# --- User data: install Docker + AWS CLI on Ubuntu ---

locals {
  base_user_data = <<-EOF
    #!/bin/bash
    set -euo pipefail

    apt-get update -y
    apt-get install -y \
      docker.io \
      docker-compose-v2 \
      awscli \
      unzip \
      curl

    systemctl enable docker
    systemctl start docker
    usermod -aG docker ubuntu

    # CloudWatch Agent
    curl -sSf https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -o /tmp/amazon-cloudwatch-agent.deb
    dpkg -i /tmp/amazon-cloudwatch-agent.deb || true

    echo "bootstrap complete"
  EOF
}

# --- Backend EC2 (Spring Boot) ---

resource "aws_instance" "backend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.backend_instance_type
  subnet_id                   = module.network.private_app_subnet_ids[0]
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  user_data                   = local.base_user_data
  key_name                    = null

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-backend"
  })
}

# --- Frontend EC2 (Next.js) ---

resource "aws_instance" "frontend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.frontend_instance_type
  subnet_id                   = module.network.private_app_subnet_ids[1]
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  user_data                   = local.base_user_data
  key_name                    = null

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-frontend"
  })
}
