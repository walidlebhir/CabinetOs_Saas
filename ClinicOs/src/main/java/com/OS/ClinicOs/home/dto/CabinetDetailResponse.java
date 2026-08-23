package com.OS.ClinicOs.home.dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;

import java.util.List;
import java.util.UUID;

public record CabinetDetailResponse(
        UUID id ,
        String nom ,
        String specialite ,
        String ville ,
        String localisation ,
        Status status ,
        List<MedecinDetailResponse> medecins
) {
}
