package com.OS.ClinicOs.patient.Dto;

import com.OS.ClinicOs.patient.Entity.Enum.SEX;

import java.time.LocalDate;
import java.util.UUID;

public record PatientResponse(
        UUID id,
        String name,
        String email,
        LocalDate date_naissance,
        SEX sex,
        String groupe_sanguin,
        String allergie,
        String antecedents,
        String adresse,
        String ville
) {
}
