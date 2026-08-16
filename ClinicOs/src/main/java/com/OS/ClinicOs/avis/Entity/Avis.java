package com.OS.ClinicOs.avis.Entity;

import com.OS.ClinicOs.avis.Entity.Enum.StatusAvis;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "avis")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Avis extends SoftDeletableEntity {

    @Id
    @UuidGenerator
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @OneToOne
    @JoinColumn(name = "rendezvous_id")
    private Rendezvous rendezvous;

    private int note;
    private String commentaire;

    @Enumerated(EnumType.STRING)
    private StatusAvis status;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
