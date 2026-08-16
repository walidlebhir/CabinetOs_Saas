package com.OS.ClinicOs.abonnement.Entity;

import com.OS.ClinicOs.abonnement.Entity.Enum.StatusAbonnement;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "abonnement")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Abonnement extends SoftDeletableEntity {

    @Id
    @UuidGenerator
    @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    private StatusAbonnement status;

    private String stripe_customer_id;
    private String stripe_subscription_id;
    private LocalDateTime date_debut;
    private LocalDateTime date_fin;
    private LocalDateTime date_annulation;
    private LocalDateTime prochain_facturation;

    @ManyToOne
    @JoinColumn(name = "plan_abonnement_id")
    private Plan_Abonnement plan;

    @ManyToOne
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    @OneToMany(mappedBy = "abonnement")
    @Builder.Default
    private List<Paiement> paiements = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
