package com.OS.ClinicOs.renezvous.Entity;

import com.OS.ClinicOs.avis.Entity.Avis;
import com.OS.ClinicOs.dossierMedical.Entity.Dossier_medical;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.Entity.Enum.Status_RendezVous;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "rendezvous")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Rendezvous extends SoftDeletableEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "cree_par_id")
    private User creePar;

    @OneToOne(mappedBy = "rendezvous")
    private Dossier_medical dossierMedical;

    @OneToOne(mappedBy = "rendezvous")
    private Avis avis;

    private LocalTime heur_debut;
    private LocalTime heur_fin;

    @Enumerated(EnumType.STRING)
    private Status_RendezVous status;

    private String motif;
    private String note_interne;

    @CreationTimestamp
    private LocalDateTime CreatedAt;

    @UpdateTimestamp
    private LocalDateTime UpdatedAt;
}
