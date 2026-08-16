package com.OS.ClinicOs.secretaire.Entity;

import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "secretaire")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Secretaire extends SoftDeletableEntity {

    @Id
    @UuidGenerator
    @GeneratedValue
    private UUID id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "teliphone")
    private String teliphone;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "date_embauche")
    private LocalDateTime dateEmbauche;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;


    @CreationTimestamp
    private LocalDateTime CreatedAt;

    @UpdateTimestamp
    private LocalDateTime UpdatedAt;
}
