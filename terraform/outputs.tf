output "matchmaking-ip" {
  value = module.matchmaking.ip
}

output "websocket-ip" {
  value = module.websocket.ip
}

output "engine_ip" {
  description = "The DNS name of the chess‑engine load‑balancer"
  value       = module.engine.ip
}
