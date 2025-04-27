variable "database_url" {
  description = "Database connection string (pulled from root var.database_url / SSM)"
  type        = string
}

variable "websocket_image" {
  description = "Docker image for websocket server"
  type        = string
  default     = "public.ecr.aws/h9h4w9x1/websocketchesscloud:latest"
}