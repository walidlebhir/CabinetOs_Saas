package com.OS.ClinicOs.dossierMedical.Entity;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
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
@Table(name = "dossier_medical")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Dossier_medical extends SoftDeletableEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String diagnostic;
    private String observation;
    private String traitement;

    private LocalDateTime date_consultation;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @OneToOne
    @JoinColumn(name = "rendezvous_id")
    private Rendezvous rendezvous;

    @OneToMany(mappedBy = "dossierMedical")
    @Builder.Default
    private List<Ordonnance> ordonnances = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime CreatedAt;

    @UpdateTimestamp
    private LocalDateTime UpdatedAt;
}
