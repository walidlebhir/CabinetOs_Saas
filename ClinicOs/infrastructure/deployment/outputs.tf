output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "backend_ec2_id" {
  description = "Instance ID of the Spring Boot backend"
  value       = aws_instance.backend.id
}

output "frontend_ec2_id" {
  description = "Instance ID of the Next.js frontend"
  value       = aws_instance.frontend.id
}

output "rds_endpoint" {
  description = "Endpoint of the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  description = "Port of the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.port
}

output "s3_bucket_name" {
  description = "Name of the private medical documents S3 bucket"
  value       = aws_s3_bucket.medical_documents.id
}

output "security_group_ids" {
  description = "IDs of the created security groups"
  value = {
    alb = aws_security_group.alb.id
    app = aws_security_group.app.id
    rds = aws_security_group.rds.id
  }
}

output "backend_target_group_arn" {
  description = "ARN of the backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = aws_lb_target_group.frontend.arn
}
