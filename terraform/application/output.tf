output "instace_public_ip" {
    description = "Public IP of the instance"
    value = aws_lb.chesscloud_alb.dns_name
}