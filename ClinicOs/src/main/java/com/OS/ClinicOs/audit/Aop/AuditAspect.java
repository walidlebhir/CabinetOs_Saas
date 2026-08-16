package com.OS.ClinicOs.audit.Aop;

import com.OS.ClinicOs.audit.Services.AuditService;
import com.OS.ClinicOs.audit.annotation.Audit;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService ;

    public AuditAspect(AuditService auditService){
        this.auditService = auditService ;
    }

    @Around("@annotation(audit)")
    public Object auditMethod(ProceedingJoinPoint joinPoint , Audit audit) throws Throwable {
        String entite = joinPoint.getTarget().getClass().getSimpleName() ;

        try {
            return joinPoint.proceed() ;
        }finally {
            auditService.saveAuditLog(audit.operation() , entite , audit.description()) ;
        }
    }
}
