package com.OS.ClinicOs.planning.Repository;

import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite_Medcin , Long> {

    List<Disponibilite_Medcin> findByMedecin_Id(UUID medecinId) ;

    List<Disponibilite_Medcin> findByMedecin_IdAndJoursemaine(UUID medecinId , Week_Day joursemaine) ;
}
