# Network Infrastructure - Medical SaaS

## Architecture

```
AWS
│
└── VPC (10.0.0.0/16)
    │
    ├── Availability Zone A
    │   ├── Public Subnet A        (10.0.1.0/24)
    │   ├── Private App Subnet A   (10.0.11.0/24)
    │   └── Private DB Subnet A    (10.0.21.0/24)
    │
    └── Availability Zone B
        ├── Public Subnet B        (10.0.2.0/24)
        ├── Private App Subnet B   (10.0.12.0/24)
        └── Private DB Subnet B    (10.0.22.0/24)
```

## Subnet Roles

| Tier | Purpose |
|------|---------|
| **Public** | Internet-facing resources (Load Balancers, Bastion) |
| **Private App** | Application tier (Spring Boot, Next.js, microservices) |
| **Private DB** | Database tier (RDS PostgreSQL) |

## Quick Start

```bash
# Initialize Terraform
terraform init

# Format configuration files
terraform fmt

# Validate configuration
terraform validate

# Preview infrastructure changes
terraform plan

# Apply infrastructure
terraform apply

# Destroy infrastructure
terraform destroy
```

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `aws_region` | `eu-west-3` | AWS region |
| `vpc_cidr` | `10.0.0.0/16` | VPC CIDR block |
| `project_name` | `medical-saas` | Project name |
| `environment` | `dev` | Deployment environment |

## Outputs

| Output | Description |
|--------|-------------|
| `vpc_id` | ID of the VPC |
| `vpc_cidr` | CIDR block of the VPC |
| `availability_zones` | AZs used |
| `public_subnet_ids` | IDs of public subnets |
| `private_app_subnet_ids` | IDs of private app subnets |
| `private_db_subnet_ids` | IDs of private DB subnets |
