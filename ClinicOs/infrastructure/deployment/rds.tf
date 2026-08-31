# --- DB Subnet Group ---

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = module.network.private_db_subnet_ids

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  })
}

# --- RDS PostgreSQL ---

resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-${var.environment}-rds"
  db_name        = var.db_name
  username       = var.db_username
  password       = var.db_password
  engine         = "postgres"
  engine_version = "16.4"
  instance_class = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az            = var.enable_multi_az
  publicly_accessible = false

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  storage_encrypted   = true
  deletion_protection = var.enable_deletion_protection
  skip_final_snapshot = false

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-rds"
  })
}
