package com.OS.ClinicOs.dossierMedical.Repository;

import com.OS.ClinicOs.dossierMedical.Entity.Dossier_medical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DossiermedicalRepository extends JpaRepository<Dossier_medical , UUID> {
}
