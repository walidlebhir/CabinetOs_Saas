package com.OS.ClinicOs.audit.Api;

import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.Services.AuditService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audit")
public class AuditApi {

    private final AuditService auditService ;

    public AuditApi(AuditService auditService){
        this.auditService = auditService ;
    }

    @GetMapping("/logs")
    public List<AuditLog> GetAllAuditLogs(){
        return auditService.getAllAuditLogs() ;
    }

    @GetMapping("/logs/user/{userId}")
    public List<AuditLog> GetAuditLogsByUser(
            @PathVariable UUID userId
    ){
        return auditService.getAuditLogsByUser(userId) ;
    }

    @GetMapping("/logs/cabinet/{cabinetId}")
    public List<AuditLog> GetAuditLogsByCabinet(
            @PathVariable UUID cabinetId
    ){
        return auditService.getAuditLogsByCabinet(cabinetId) ;
    }

    @GetMapping("/logs/action/{action}")
    public List<AuditLog> GetAuditLogsByAction(
            @PathVariable Action action
    ){
        return auditService.getAuditLogsByAction(action) ;
    }
}
