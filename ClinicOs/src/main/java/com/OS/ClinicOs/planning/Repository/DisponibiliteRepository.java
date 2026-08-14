package com.OS.ClinicOs.planning.Repository;

import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisponibiliteRepository extends JpaRepository<Disponibilite_Medcin , Long> {

}
