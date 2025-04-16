resource "kubernetes_namespace" "stockfish" {
  metadata {
    name = var.kubernetes_namespace
  }
}

locals {
  kubernetes_yaml_dir = "${path.module}/../../kubernetes"
  stockfish_yaml_files = fileset(local.kubernetes_yaml_dir, "stockfish/*.yaml")
  axum_yaml_files = fileset(local.kubernetes_yaml_dir, "axum/*.yaml")
}

resource "kubectl_manifest" "stockfish_resources" {
  for_each  = { for file in local.stockfish_yaml_files : file => file }
  yaml_body = templatefile("${local.kubernetes_yaml_dir}/${each.value}", {
    ECR_REPO_URL = var.stockfish_ecr_url
  })

  depends_on = [kubernetes_namespace.stockfish]
}

resource "kubectl_manifest" "axum_resources" {
  for_each  = { for file in local.axum_yaml_files : file => file }
  yaml_body = templatefile("${local.kubernetes_yaml_dir}/${each.value}", {
    ECR_REPO_URL = var.axum_ecr_url
  })

  depends_on = [kubernetes_namespace.stockfish, kubectl_manifest.stockfish_resources]
}

data "kubernetes_service" "axum" {
  metadata {
    name      = "axum"
    namespace = var.kubernetes_namespace
  }
  depends_on = [kubectl_manifest.axum_resources]
}