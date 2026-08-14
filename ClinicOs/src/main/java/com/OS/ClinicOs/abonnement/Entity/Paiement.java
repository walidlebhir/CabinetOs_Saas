package com.OS.ClinicOs.abonnement.Entity;

import com.OS.ClinicOs.abonnement.Entity.Enum.StatusPayement;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "paiement")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Paiement {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "abonnement_id")
    private Abonnement abonnement;

    @ManyToOne
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    private String stripe_payment_id;
    private BigDecimal montant;
    private String devis;

    @Enumerated(EnumType.STRING)
    private StatusPayement status;

    private LocalDateTime date_paiement;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
