package com.OS.ClinicOs.renezvous.Repository;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RendezvousRepository extends JpaRepository<Rendezvous , UUID> {

    Optional<Rendezvous> findByDateRendezvous(LocalDate dateRendezvous);
    List<Rendezvous> findAllByDateRendezvous(LocalDate dateRendezvous);
    List<Rendezvous> findAllByMedecin(Medecin medecin );
    List<Rendezvous> findAllByMedecin_Cabinet_Id(UUID cabinetId);
    List<Rendezvous> findAllByPatient(Patient patient);
}
