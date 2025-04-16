# ChessCloud Engine AWS EKS Deployment

This directory contains Terraform configurations to deploy the ChessCloud engine components to AWS EKS.

## Directory Structure

```
terraform/
├── eks/                   # Main EKS cluster configuration
├── modules/
│   └── k8s/               # Kubernetes resources module
└── kubernetes/            # Kubernetes YAML manifests
    ├── stockfish/         # Stockfish engine manifests
    └── axum/              # Axum API manifests
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0
- kubectl
- An AWS account with permissions to create EKS clusters

## Deployment Steps

1. Navigate to the `eks` directory:

   ```bash
   cd eks
   ```

2. Initialize Terraform:

   ```bash
   terraform init
   ```

3. Plan the deployment:

   ```bash
   terraform plan
   ```

4. Apply the configuration:

   ```bash
   terraform apply
   ```

5. Configure kubectl after the deployment:

   ```bash
   aws eks update-kubeconfig --region ap-southeast-1 --name chesscloud-cluster
   ```

6. Verify the deployment:

   ```bash
   kubectl get pods -n stockfish
   kubectl get services -n stockfish
   ```

## Configuration

The default configuration assumes:

- Region: ap-southeast-1
- ECR Repository URLs:
  - Stockfish: 058264495198.dkr.ecr.ap-southeast-1.amazonaws.com/stockfish
  - Axum: 058264495198.dkr.ecr.ap-southeast-1.amazonaws.com/axum

You can modify these values in the `eks/variables.tf` file.

## Cleanup

To destroy all resources:

```bash
terraform destroy
```