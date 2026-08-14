package com.OS.ClinicOs.dossierMedical.Repository;

import com.OS.ClinicOs.dossierMedical.Entity.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance , Long> {
}
