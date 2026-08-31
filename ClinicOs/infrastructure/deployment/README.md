# Deployment Infrastructure - Medical SaaS

This layer deploys the application resources on top of the existing network module. It **reuses** the VPC and subnets created by `../network` and never recreates them.

## 1. Architecture

```
                         INTERNET
                             │
                             ▼
                    ┌─────────────────┐
                    │     ALB         │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       Private App A                 Private App B
              │                             │
              ▼                             ▼
   EC2 Spring Boot (8080)         EC2 Next.js (3000)
              │
              ▼
 Private DB Subnets
              │
              ▼
 RDS PostgreSQL (5432)

       │
       └──────────────────► S3 (medical documents, private)
```

## 2. Dependency on the network module

- The `../network` module is loaded in `main.tf` and provides the VPC id and subnet ids.
- No VPC, subnet or AZ is recreated in this layer.

```hcl
module "network" {
  source = "../network"
}
```

## 3. Security Groups

| Group | Inbound | Outbound |
|-------|---------|----------|
| `alb-sg` | HTTP 80 and HTTPS 443 from `0.0.0.0/0` | all |
| `app-sg` | 8080 and 3000 from **ALB SG only**; 443 from internet (SSM) | all |
| `rds-sg` | 5432 from **app SG only** | all |

Never exposed publicly: 8080, 3000, 5432, 22.

## 4. ALB

- Public Application Load Balancer across Public Subnet A and B.
- HTTP listener on port 80.
- Routing:
  - `/api/*` → `backend-tg` (Spring Boot, port 8080)
  - `/*` (default) → `frontend-tg` (Next.js, port 3000)
- HTTPS structure is ready to add later (ACM + 443 listener) once a domain is provided.

## 5. EC2 Spring Boot

- Ubuntu 22.04, x86_64, `t3.small`.
- Private App Subnet A, public IP disabled.
- Listens on 8080, reachable only via the ALB.
- Docker, AWS CLI and CloudWatch Agent installed via `user_data`.

## 6. EC2 Next.js

- Ubuntu 22.04, x86_64, `t3.small`.
- Private App Subnet B, public IP disabled.
- Listens on 3000, reachable only via the ALB.
- Docker, AWS CLI and CloudWatch Agent installed via `user_data`.

## 7. RDS PostgreSQL

- `db.t3.micro`, 20 GB gp3 storage.
- Private, not publicly accessible, in the DB subnet group (DB Subnet A + B).
- Port 5432, reachable only from the app security group.
- Automatic backups, encryption at rest, configurable Multi-AZ and deletion protection.

## 8. S3

- Private bucket for medical documents with:
  - Block Public Access (all four toggles on)
  - Versioning
  - Server-side encryption (AES256)
- Backend can `PutObject`, `GetObject`, `DeleteObject`, `ListBucket` only on this bucket.

## 9. IAM

- EC2 instance profile with:
  - SSM (Session Manager access)
  - CloudWatch Agent
  - Minimal S3 policy scoped to the medical bucket (least privilege)
- No AWS access keys are stored in `.env`, Dockerfiles, Terraform or Git.

## 10. Terraform commands

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform destroy
```

`db_password` is a sensitive variable that must be passed at runtime, e.g.:

```bash
terraform plan -var db_password='your-secret'
```

For real secrets, use AWS Secrets Manager in a later step.

## 11. NAT Gateway note

The EC2 instances live in private subnets and need outbound internet for `apt`, Docker, external APIs. A NAT Gateway in the **network** layer is required for this. If the network module has no NAT Gateway yet, add one there first before applying this layer.

## Next steps

- Add NAT Gateway to the network layer.
- Add HTTPS via ACM + 443 listener + Route 53.
- Pre-signed URLs for medical files.
- Move secrets to AWS Secrets Manager.
- Auto Scaling Groups, ECR/ECS or EKS for the app tier.
