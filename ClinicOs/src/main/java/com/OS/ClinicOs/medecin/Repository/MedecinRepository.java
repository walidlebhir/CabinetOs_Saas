package com.OS.ClinicOs.medecin.Repository;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin , UUID> {
}
