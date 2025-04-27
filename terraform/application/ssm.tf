resource "aws_ssm_parameter" "google_auth_endpoint" {
  name        = "/chesscloud/google_auth_endpoint"
  description = "Google Auth Endpoint for ChessCloud"
  type        = "SecureString"
  value       = var.google_auth_endpoint
  tier        = "Standard"

  tags = {
    environment = "production"
    application = "chesscloud"
  }
}

resource "aws_ssm_parameter" "database_url" {
  name        = "/chesscloud/database_url"
  description = "Database URL for ChessCloud"
  type        = "SecureString"
  value       = var.database_url
  tier        = "Standard"

  tags = {
    environment = "production"
    application = "chesscloud"
  }
}