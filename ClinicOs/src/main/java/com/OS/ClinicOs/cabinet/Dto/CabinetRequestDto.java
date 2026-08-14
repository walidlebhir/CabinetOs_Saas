package com.OS.ClinicOs.cabinet.Dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;

public record CabinetRequestDto(
        String nom ,
        String specialite ,
        String ville ,
        Status status,
        String localisation
) {
}
