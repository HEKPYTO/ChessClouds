resource "aws_lb" "chesscloud_alb" {
  name               = "chesscloud-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.chesscloud_sg.id]
  subnets            = [
    aws_subnet.chesscloud_public_subnet.id,
    aws_subnet.chesscloud_public_subnet_2.id
  ]

  tags = {
    Name = "chesscloud-alb"
  }
}


resource "aws_lb_target_group" "chesscloud_tg" {
  name     = "chesscloud-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.chesscloud_vpc.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  target_type = "ip" # required for Fargate
}

resource "aws_lb_listener" "chesscloud_listener" {
  load_balancer_arn = aws_lb.chesscloud_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.chesscloud_tg.arn
  }
}
