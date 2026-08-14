package com.OS.ClinicOs.planning.Entity;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "indisponibilite")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Indisponibilite {

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
