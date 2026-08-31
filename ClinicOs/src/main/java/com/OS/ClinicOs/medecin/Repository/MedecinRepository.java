package com.OS.ClinicOs.medecin.Repository;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin , UUID> {

    List<Medecin> findByCabinet_Id(UUID cabinetId) ;

    boolean existsByNumeroOrderAndDeletedAtIsNull(String numeroOrder) ;

    @Query(value = "SELECT * FROM medecin WHERE id = :id" , nativeQuery = true)
    Optional<Medecin> findByIdIncludingDeleted(@Param("id") UUID id) ;
}
