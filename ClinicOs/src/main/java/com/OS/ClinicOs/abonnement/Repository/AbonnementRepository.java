package com.OS.ClinicOs.abonnement.Repository;

import com.OS.ClinicOs.abonnement.Entity.Abonnement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AbonnementRepository extends JpaRepository<Abonnement, UUID> {
}
