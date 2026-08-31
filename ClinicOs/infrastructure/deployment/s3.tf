# --- Private S3 bucket for medical documents ---

resource "aws_s3_bucket" "medical_documents" {
  bucket        = var.s3_bucket_name
  force_destroy = false

  tags = merge(local.common_tags, {
    Name = var.s3_bucket_name
  })
}

resource "aws_s3_bucket_public_access_block" "medical_documents" {
  bucket = aws_s3_bucket.medical_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "medical_documents" {
  bucket = aws_s3_bucket.medical_documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "medical_documents" {
  bucket = aws_s3_bucket.medical_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
