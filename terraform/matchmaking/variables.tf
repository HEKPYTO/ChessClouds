variable "database_url" {
  description = "Database connection string (pulled from root var.database_url / SSM)"
  type        = string
}

variable "matchmaking_image" {
  description = "Docker image for matchmaking server"
  type        = string
  default     = "public.ecr.aws/h9h4w9x1/matchmaking:latest"
}