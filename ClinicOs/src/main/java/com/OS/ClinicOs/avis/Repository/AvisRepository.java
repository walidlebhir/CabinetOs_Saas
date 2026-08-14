package com.OS.ClinicOs.avis.Repository;

import com.OS.ClinicOs.avis.Entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AvisRepository extends JpaRepository<Avis, UUID> {
}
