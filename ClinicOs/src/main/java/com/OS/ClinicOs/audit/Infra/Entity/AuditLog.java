package com.OS.ClinicOs.audit.Infra.Entity;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    @Enumerated(EnumType.STRING)
    private Action action;

    private String entite;
    private String description;
    private String ip_adress;
    private String user_agent;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
