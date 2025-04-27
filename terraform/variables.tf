variable "database_url" {
  description = "Database connection string"
  type        = string
}

variable "google_auth_endpoint" {
  description = "Google Auth endpoint"
  type        = string
}

variable "engine_api_url" {
  description = "NEXT_PUBLIC_ENGINE_API_URL"
  type        = string
  default     = ""
}

variable "websocket_url" {
  description = "NEXT_PUBLIC_WS_SERVER_URL"
  type        = string
  default     = ""
}

variable "matchmaking_url" {
  description = "NEXT_PUBLIC_MATCHMAKING_SERVER_URL"
  type        = string
  default     = ""
}

variable "engine_image" {
  description = "Docker image for combined chess engine service"
  type        = string
  default     = "public.ecr.aws/h9h4w9x1/chess-engine:latest"
}

variable "websocket_image" {
  description = "Docker image for WebSocket server"
  type        = string
  default     = "public.ecr.aws/h9h4w9x1/websocketchesscloud:latest"
}

variable "matchmaking_image" {
  description = "Docker image for Matchmaking server"
  type        = string
  default     = "public.ecr.aws/h9h4w9x1/matchmaking:latest"
}