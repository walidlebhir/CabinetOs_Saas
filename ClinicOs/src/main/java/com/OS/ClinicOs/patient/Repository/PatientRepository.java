package com.OS.ClinicOs.patient.Repository;

import com.OS.ClinicOs.patient.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
}
