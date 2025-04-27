resource "aws_ecs_cluster" "my_cluster" {
  name = "CHESSCLOUD"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "my_task_definition" {
  family                   = "ChessCloudTask"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024"
  memory                   = "3072"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name      = "ChessCloud"
    image     = "public.ecr.aws/h9h4w9x1/chesscloud:latest"
    cpu       = 0
    essential = true

    portMappings = [{
      name          = "connecttoapp"
      containerPort = 3000
      protocol      = "tcp"
      appProtocol   = "http"
    }]

    secrets = [
      {
        name      = "DATABASE_URL"
        valueFrom = aws_ssm_parameter.database_url.arn
      },
      {
        name      = "NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT"
        valueFrom = aws_ssm_parameter.google_auth_endpoint.arn
      }
    ]

    environment = [
      {
        name  = "NODE_ENV"
        value = "production"
      },
      {
        name  = "NEXT_PUBLIC_ENGINE_API_URL"
        value = "http://${var.engine_ip}:4000"
      },
      {
        name  = "NEXT_PUBLIC_WS_SERVER_URL"
        value = "ws://${var.websocket_ip}:8000/ws"
      },
      {
        name  = "NEXT_PUBLIC_MATCHMAKING_SERVER_URL"
        value = "http://${var.matchmaking_ip}:8001"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/ChessCloudTask"
        awslogs-region        = "ap-southeast-1"
        awslogs-stream-prefix = "ecs"
        mode                  = "non-blocking"
        max-buffer-size       = "25m"
      }
    }
  }])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_ecs_service" "my_ecs_service" {
  name            = "chesscloudservice"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  propagate_tags  = "SERVICE"
  enable_execute_command = true

  network_configuration {
    subnets          = [aws_subnet.chesscloud_public_subnet.id, aws_subnet.chesscloud_public_subnet_2.id]
    security_groups  = [aws_security_group.chesscloud_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.chesscloud_tg.arn
    container_name   = "ChessCloud"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.chesscloud_listener]
}