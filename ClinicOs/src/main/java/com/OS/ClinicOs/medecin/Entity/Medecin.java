package com.OS.ClinicOs.medecin.Entity;

import com.OS.ClinicOs.avis.Entity.Avis;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.dossierMedical.Entity.Dossier_medical;
import com.OS.ClinicOs.dossierMedical.Entity.Ordonnance;
import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import com.OS.ClinicOs.planning.Entity.Indisponibilite;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "medecin")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Medecin {

    @Id
    @UuidGenerator
    @GeneratedValue
    private UUID id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "specialite")
    private String specialite;

    @Column(name = "numero_order")
    private String numeroOrder;

    @Column(name = "teliphone")
    private String teliphone;

    @Column(name = "biographie")
    private String biographie;

    @Column(name = "annees_experience")
    private int anneesExperience;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Disponibilite_Medcin> disponibilites = new ArrayList<>();

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Indisponibilite> indisponibilites = new ArrayList<>();

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Rendezvous> rendezvous = new ArrayList<>();

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Dossier_medical> dossiers = new ArrayList<>();

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Ordonnance> ordonnances = new ArrayList<>();

    @OneToMany(mappedBy = "medecin")
    @Builder.Default
    private List<Avis> avis = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime CreatedAt;

    @UpdateTimestamp
    private LocalDateTime UpdatedAt;
}
