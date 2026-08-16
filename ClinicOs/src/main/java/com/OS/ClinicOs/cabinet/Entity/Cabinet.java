package com.OS.ClinicOs.cabinet.Entity;

import com.OS.ClinicOs.abonnement.Entity.Abonnement;
import com.OS.ClinicOs.abonnement.Entity.Paiement;
import com.OS.ClinicOs.audit.Infra.Entity.AuditLog;
import com.OS.ClinicOs.cabinet.Entity.Enum.Status;
import com.OS.ClinicOs.medecin.Entity.Medecin;
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
@Table(name = "cabinet")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Cabinet extends SoftDeletableEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "specialite")
    private String specialite;

    private String ville;

    private String localisation ;


    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "cabinet")
    @Builder.Default
    private List<Medecin> medecins = new ArrayList<>();

    @OneToMany(mappedBy = "cabinet")
    @Builder.Default
    private List<Abonnement> abonnements = new ArrayList<>();

    @OneToMany(mappedBy = "cabinet")
    @Builder.Default
    private List<Paiement> paiements = new ArrayList<>();

    @OneToMany(mappedBy = "cabinet")
    @Builder.Default
    private List<AuditLog> auditLogs = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
