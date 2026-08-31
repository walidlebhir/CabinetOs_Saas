package com.OS.ClinicOs.secretaire.Repository;

import com.OS.ClinicOs.secretaire.Entity.Secretaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecretaireRepository extends JpaRepository<Secretaire , UUID> {
    List<Secretaire> findByCabinet_Id(UUID cabinetId);
    Optional<Secretaire> findByUser_Email(String email);
    List<Secretaire> findByNomContainingIgnoreCase(String nom);
    List<Secretaire> findByPrenomContainingIgnoreCase(String prenom);
    List<Secretaire> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(String nom, String prenom);
}
