package com.OS.ClinicOs.planning.Repository;

import com.OS.ClinicOs.planning.Entity.Indisponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface Indesponibilitrepository extends JpaRepository<Indisponibilite , Long> {

    List<Indisponibilite> findByMedecin_Id(UUID medecinId) ;
}
