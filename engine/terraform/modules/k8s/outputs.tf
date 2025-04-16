output "axum_api_url" {
  description = "URL to access the Axum API"
  value       = data.kubernetes_service.axum.status[0].load_balancer[0].ingress[0].hostname
}