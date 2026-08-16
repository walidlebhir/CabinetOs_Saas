package com.OS.ClinicOs.user.Entity;

import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import com.OS.ClinicOs.authentification.Entity.Refresh_Token;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.notification.Entity.Notification;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class User extends SoftDeletableEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String name ;
    private String email;
    private String password;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user")
    private Medecin medecin;

    @OneToOne(mappedBy = "user")
    private Patient patient;

    @OneToMany(mappedBy = "creePar")
    @Builder.Default
    private List<Rendezvous> rendezvousCrees = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Refresh_Token> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<AuditLog> auditLogs = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime CreatedAt;

    @UpdateTimestamp
    private LocalDateTime UpdatedAt;
}
