package com.OS.ClinicOs.home.dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;

import java.util.UUID;

public record CabinetHomeResponse(
        UUID id ,
        String nom ,
        String specialite ,
        String ville ,
        String localisation ,
        Status status ,
        int nombreMedecins
) {
}
