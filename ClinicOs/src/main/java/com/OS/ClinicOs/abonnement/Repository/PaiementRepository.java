package com.OS.ClinicOs.abonnement.Repository;

import com.OS.ClinicOs.abonnement.Entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
}
