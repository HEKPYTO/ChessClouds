variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "chesscloud-cluster"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "az_count" {
  description = "Number of AZs to use"
  type        = number
  default     = 2
}

variable "kubernetes_version" {
  description = "Kubernetes version to use for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "node_group_min_size" {
  description = "Minimum size of the node group"
  type        = number
  default     = 1
}

variable "node_group_max_size" {
  description = "Maximum size of the node group"
  type        = number
  default     = 3
}

variable "node_group_desired_size" {
  description = "Desired size of the node group"
  type        = number
  default     = 2
}

variable "node_group_instance_types" {
  description = "Instance types for the node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "stockfish_ecr_url" {
  description = "ECR repository URL for Stockfish"
  type        = string
  default     = "058264495198.dkr.ecr.ap-southeast-1.amazonaws.com/stockfish"
}

variable "axum_ecr_url" {
  description = "ECR repository URL for Axum API"
  type        = string
  default     = "058264495198.dkr.ecr.ap-southeast-1.amazonaws.com/axum"
}

variable "kubernetes_namespace" {
  description = "Kubernetes namespace for deployments"
  type        = string
  default     = "stockfish"
}