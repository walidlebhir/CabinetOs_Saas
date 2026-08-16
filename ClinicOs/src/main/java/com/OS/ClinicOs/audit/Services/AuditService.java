package com.OS.ClinicOs.audit.Services;

import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.Infra.Repository.AuditLogRepository;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.UUID;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository ;
    private final UserRepository userRepository ;

    public AuditService(
            AuditLogRepository auditLogRepository ,
            UserRepository userRepository
    ){
        this.auditLogRepository = auditLogRepository ;
        this.userRepository = userRepository ;
    }

    public AuditLog saveAuditLog(Action action , String entite , String description) {
        try{

            User user = getCurrentUser() ;
            Cabinet cabinet = getCurrentCabinet(user) ;

            AuditLog log = AuditLog.builder()
                    .user(user)
                    .cabinet(cabinet)
                    .action(action)
                    .entite(entite)
                    .description(description)
                    .ip_adress(getClientIp())
                    .user_agent(getUserAgent())
                    .build();

            return auditLogRepository.save(log) ;

        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database : " + e.getMessage()) ;
            throw new DatabaseConnexionException("data base conection problem ") ;
        }
    }

    public List<AuditLog> getAllAuditLogs() {
        try{
            return auditLogRepository.findAllByOrderByCreatedAtDesc() ;
        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database : " + e.getMessage()) ;
            throw new DatabaseConnexionException("data base conection problem ") ;
        }
    }

    public List<AuditLog> getAuditLogsByUser(UUID userId) {
        try{
            return auditLogRepository.findByUser_Id(userId) ;
        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database : " + e.getMessage()) ;
            throw new DatabaseConnexionException("data base conection problem ") ;
        }
    }

    public List<AuditLog> getAuditLogsByCabinet(UUID cabinetId) {
        try{
            return auditLogRepository.findByCabinet_Id(cabinetId) ;
        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database : " + e.getMessage()) ;
            throw new DatabaseConnexionException("data base conection problem ") ;
        }
    }

    public List<AuditLog> getAuditLogsByAction(Action action) {
        try{
            return auditLogRepository.findByAction(action) ;
        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database : " + e.getMessage()) ;
            throw new DatabaseConnexionException("data base conection problem ") ;
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication() ;

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || authentication.getPrincipal().equals("anonymousUser")) {
            return null ;
        }

        return userRepository.findByEmailAndDeletedAtIsNull(authentication.getName()) ;
    }

    private Cabinet getCurrentCabinet(User user) {
        if (user == null) return null ;
        if (user.getMedecin() != null && user.getMedecin().getCabinet() != null){
            return user.getMedecin().getCabinet() ;
        }
        return null ;
    }

    private String getClientIp() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes() ;
        if (attributes == null) return null ;
        HttpServletRequest request = attributes.getRequest() ;
        return request.getRemoteAddr() ;
    }

    private String getUserAgent() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes() ;
        if (attributes == null) return null ;
        HttpServletRequest request = attributes.getRequest() ;
        return request.getHeader("User-Agent") ;
    }
}
