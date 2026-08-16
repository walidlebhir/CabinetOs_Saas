package com.OS.ClinicOs.audit.Infra.Repository;

import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUser_Id(UUID userId) ;

    List<AuditLog> findByCabinet_Id(UUID cabinetId) ;

    List<AuditLog> findByAction(Action action) ;

    List<AuditLog> findAllByOrderByCreatedAtDesc() ;
}
