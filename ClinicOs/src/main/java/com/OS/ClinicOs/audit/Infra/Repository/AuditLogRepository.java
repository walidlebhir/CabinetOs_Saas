package com.OS.ClinicOs.audit.Infra.Repository;

import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
