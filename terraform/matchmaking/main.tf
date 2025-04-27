data "aws_vpc" "default" {
  default = true
}

resource "aws_instance" "app" {
  ami                         = "ami-05ab12222a9f39021" # Amazon Linux 2 (update based on region)
  instance_type               = "t3.micro"
  vpc_security_group_ids      = [aws_security_group.matchmaking_sg.id]
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/init.sh", {
    matchmaking_image = var.matchmaking_image,
    database_url      = var.database_url
  })

  tags = {
    Name = "ChessCloud-Matchmaking"
  }

  root_block_device {
    volume_size = 10
    volume_type = "gp3"
    encrypted   = true
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }
}

output "ip" {
  description = "Matchmaking Server Public IP"
  value       = aws_instance.app.public_ip
}

