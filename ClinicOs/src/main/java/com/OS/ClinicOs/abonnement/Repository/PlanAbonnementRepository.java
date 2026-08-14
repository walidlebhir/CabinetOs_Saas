package com.OS.ClinicOs.abonnement.Repository;

import com.OS.ClinicOs.abonnement.Entity.Plan_Abonnement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlanAbonnementRepository extends JpaRepository<Plan_Abonnement, UUID> {
}
