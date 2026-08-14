package com.OS.ClinicOs.abonnement.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "planabonnement")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Plan_Abonnement {

    @Id @UuidGenerator
    @GeneratedValue
    private UUID id;

    private String name;
    private String code;
    private String description;
    private BigDecimal prix_mensuel;
    private BigDecimal prix_annuel;
    private int max_secretaires;
    private int maxpatient;
    private int max_rdv_mensuels;
    private String fonctionnalites;
    private boolean actif;

    @OneToMany(mappedBy = "plan")
    @Builder.Default
    private List<Abonnement> abonnements = new ArrayList<>();
}
