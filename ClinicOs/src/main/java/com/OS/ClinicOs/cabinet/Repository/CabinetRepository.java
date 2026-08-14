package com.OS.ClinicOs.cabinet.Repository;

import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CabinetRepository extends JpaRepository<Cabinet, UUID> {
}
