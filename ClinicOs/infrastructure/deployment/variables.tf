variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-west-3"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "medical-saas"
}

variable "backend_instance_type" {
  description = "EC2 instance type for the Spring Boot backend"
  type        = string
  default     = "t3.small"
}

variable "frontend_instance_type" {
  description = "EC2 instance type for the Next.js frontend"
  type        = string
  default     = "t3.small"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "medical_saas"
}

variable "db_username" {
  description = "Master username for the PostgreSQL database"
  type        = string
  default     = "medical_admin"
}

variable "db_password" {
  description = "Master password for the PostgreSQL database. Must be provided at runtime (never stored in Git)."
  type        = string
  sensitive   = true
}

variable "enable_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection on RDS"
  type        = bool
  default     = false
}

variable "s3_bucket_name" {
  description = "Name of the private S3 bucket for medical documents"
  type        = string
  default     = "medical-saas-medical-documents"
}
