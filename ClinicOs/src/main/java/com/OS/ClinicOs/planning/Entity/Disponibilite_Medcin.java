package com.OS.ClinicOs.planning.Entity;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "disponibilite_medcin")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Disponibilite_Medcin extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @Enumerated(EnumType.STRING)
    private Week_Day joursemaine;

    private LocalTime heur_debut;
    private LocalTime heur_fin;
    private int dure_creneau;
    private LocalTime pause_debut;
    private LocalTime pause_fin;
    private Boolean actif;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
