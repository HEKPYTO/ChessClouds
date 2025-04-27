module "websocket" {
  source          = "./websocket"
  database_url    = var.database_url
  websocket_image = var.websocket_image
}

module "matchmaking" {
  source           = "./matchmaking"
  database_url     = var.database_url
  matchmaking_image = var.matchmaking_image
}

module "engine" {
  source       = "./engine"
  engine_image = var.engine_image
}

module "application" {
    source            = "./application"
    websocket_ip      = module.websocket.ip
    matchmaking_ip    = module.matchmaking.ip
    database_url      = var.database_url
    google_auth_endpoint = var.google_auth_endpoint
    engine_ip         = module.engine.ip
}