resource "aws_security_group" "ecs_sg" {
  name        = "chess-engine-ecs-sg"
  description = "Security group for chess engine ECS services"
  vpc_id      = aws_vpc.engine_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "chess-engine-ecs-sg"
  }
}