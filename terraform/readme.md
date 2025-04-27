# ChessClouds Infrastructure

This directory contains the Terraform infrastructure as code (IaC) configuration for deploying the ChessClouds platform to AWS.

## Architecture

The infrastructure deploys four main components:

1. **Web Application** - The Next.js frontend deployed as a containerized ECS Fargate service
2. **Chess Engine** - Stockfish-based API service for computer opponents and move analysis
3. **WebSocket Server** - Real-time game communication service
4. **Matchmaking Service** - Player pairing service

![Infrastructure Overview](../resources/overview-arch.jpg)

## Deployment Architecture

Each service is deployed as follows:

- **Web Application**: ECS Fargate behind an Application Load Balancer
- **Chess Engine**: ECS Fargate behind an Application Load Balancer
- **WebSocket Server**: EC2 instance with Docker
- **Matchmaking Service**: EC2 instance with Docker

## Prerequisites

- AWS Account with appropriate permissions
- Terraform 1.2.0 or newer
- AWS CLI configured with access credentials
- Docker (for building and pushing container images)
- PostgreSQL database (can be provisioned separately)

## Configuration

1. Copy the template variables file:

```bash
cp template.tfvars terraform.tfvars
```

2. Edit `terraform.tfvars` with your specific configuration:

```hcl
database_url = "postgresql://username:password@hostname:5432/database_name"
google_auth_endpoint = "https://your-google-auth-endpoint.com"
```

## Deploying Infrastructure

1. Initialize the Terraform working directory:

```bash
terraform init
```

2. Preview the changes:

```bash
terraform plan -var-file=terraform.tfvars
```

3. Apply the infrastructure:

```bash
terraform apply -var-file=terraform.tfvars
```

## Module Structure

- **application/** - ECS Fargate setup for the web frontend
- **engine/** - Chess engine service infrastructure
- **websocket/** - WebSocket server instance
- **matchmaking/** - Matchmaking service instance

## Security Considerations

- All services are deployed with security groups limiting access
- ECS tasks use IAM roles with least privilege
- SSM parameters are used for secret management
- HTTPS endpoints are supported for production environments

## Outputs

After deployment, you'll receive the following outputs:

- `matchmaking-ip` - The public IP address of the matchmaking service
- `websocket-ip` - The public IP address of the WebSocket server
- `engine_ip` - The DNS name of the chess engine load balancer

## Cleanup

To destroy the infrastructure:

```bash
terraform destroy -var-file=terraform.tfvars
```

## CI/CD Integration

This infrastructure can be deployed through CI/CD pipelines by:

1. Storing the `terraform.tfvars` file securely in your CI/CD system
2. Using Terraform Cloud or AWS CodePipeline for state management
3. Automating the terraform init/plan/apply workflow

## Customization

You can customize the deployment by modifying the following variables:

- `engine_image` - Docker image for the chess engine
- `websocket_image` - Docker image for the WebSocket server
- `matchmaking_image` - Docker image for the matchmaking service