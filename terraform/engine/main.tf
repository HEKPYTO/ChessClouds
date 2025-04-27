resource "aws_vpc" "engine_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "chess-engine-vpc"
  }
}

resource "aws_subnet" "public_subnets" {
  count                   = 2
  vpc_id                  = aws_vpc.engine_vpc.id
  cidr_block              = count.index == 0 ? "10.0.1.0/24" : "10.0.2.0/24"
  availability_zone       = count.index == 0 ? "ap-southeast-1a" : "ap-southeast-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "chess-engine-subnet-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "engine_igw" {
  vpc_id = aws_vpc.engine_vpc.id

  tags = {
    Name = "chess-engine-igw"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.engine_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.engine_igw.id
  }

  tags = {
    Name = "chess-engine-public-rt"
  }
}

resource "aws_route_table_association" "public_subnet_associations" {
  count          = 2
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_ecs_cluster" "engine_cluster" {
  name = "chess-engine-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "chess-engine-cluster"
  }
}

resource "aws_lb" "engine_lb" {
  name               = "chess-engine-lb-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_sg.id]
  subnets            = aws_subnet.public_subnets[*].id

  tags = {
    Name = "chess-engine-lb"
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group" "engine_tg" {
  name        = "chess-engine-tg-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.engine_vpc.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 30
    interval            = 60
    matcher             = "200"
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "engine" {
  load_balancer_arn = aws_lb.engine_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.engine_tg.arn
  }
}

# Removed CloudWatch log group due to connection issues
# resource "aws_cloudwatch_log_group" "engine_logs" {
#   name              = "/ecs/chess-engine-${formatdate("YYYYMMDDhhmmss", timestamp())}"
#   retention_in_days = 7
#   
#   lifecycle {
#     create_before_destroy = true
#   }
# }

resource "aws_ecs_task_definition" "engine_task" {
  family                   = "chess-engine-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "chess-engine",
      image     = var.engine_image,
      essential = true,
      
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ],
      
      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      },
    }
  ])
}

resource "aws_ecs_service" "engine_service" {
  name            = "chess-engine-service"
  cluster         = aws_ecs_cluster.engine_cluster.id
  task_definition = aws_ecs_task_definition.engine_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.public_subnets[*].id
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.engine_tg.arn
    container_name   = "chess-engine"
    container_port   = 80
  }

  depends_on = [
    aws_lb_listener.engine,
    # Removed CloudWatch dependency
    # aws_cloudwatch_log_group.engine_logs,
    aws_iam_role_policy_attachment.ecs_task_execution_role_policy
  ]
  
  lifecycle {
    create_before_destroy = true
  }
}

output "ip" {
  value = aws_lb.engine_lb.dns_name
}