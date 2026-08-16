package com.OS.ClinicOs.planning.Entity;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "indisponibilite")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Indisponibilite extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    private LocalDateTime date_debut;
    private LocalDateTime date_fin;
    private String motif;

    @Enumerated(EnumType.STRING)
    private TypeIndisponibility type;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
