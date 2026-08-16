package com.OS.ClinicOs.patient.Entity;

import com.OS.ClinicOs.avis.Entity.Avis;
import com.OS.ClinicOs.dossierMedical.Entity.Dossier_medical;
import com.OS.ClinicOs.dossierMedical.Entity.Ordonnance;
import com.OS.ClinicOs.patient.Entity.Enum.SEX;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "patient")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Patient extends SoftDeletableEntity {

    @Id
    @UuidGenerator @GeneratedValue
    private UUID id;

    private LocalDate date_naissance;

    @Enumerated(EnumType.STRING)
    private SEX sex;

    private String groupe_sanguin;
    private String allergie;
    private String antecedents;
    private String adresse;
    private String ville;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "patient")
    @Builder.Default
    private List<Rendezvous> rendezvous = new ArrayList<>();

    @OneToMany(mappedBy = "patient")
    @Builder.Default
    private List<Dossier_medical> dossiers = new ArrayList<>();

    @OneToMany(mappedBy = "patient")
    @Builder.Default
    private List<Ordonnance> ordonnances = new ArrayList<>();

    @OneToMany(mappedBy = "patient")
    @Builder.Default
    private List<Avis> avis = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
