variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "stockfish_ecr_url" {
  description = "ECR repository URL for Stockfish"
  type        = string
}

variable "axum_ecr_url" {
  description = "ECR repository URL for Axum API"
  type        = string
}

variable "kubernetes_namespace" {
  description = "Kubernetes namespace for deployments"
  type        = string
}