variable "engine_image" {
  type    = string
  default = "public.ecr.aws/h9h4w9x1/chess-engine:latest"
  description = "Docker image for combined chess engine service"
}

variable "default_endpoint" {
  type    = string
  default = "localhost"
  description = "Default endpoint for services"
}

variable "unique_suffix" {
  type        = string
  default     = ""
  description = "Optional unique suffix for resource names to avoid conflicts"
}