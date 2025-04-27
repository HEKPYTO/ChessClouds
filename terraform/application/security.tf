resource "aws_security_group" "chesscloud_sg" {
  name        = "chesscloud-sg"
  description = "Allow inbound traffic on port 3000"
  vpc_id      = aws_vpc.chesscloud_vpc.id

  ingress {
    description = "Allow HTTP traffic on port 3000"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP traffic on port 3000"
    from_port   = 3000
    to_port     = 3000
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
    Name = "chesscloud-sg"
  }
}
