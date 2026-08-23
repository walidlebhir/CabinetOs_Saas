package com.OS.ClinicOs.cabinet.Dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;

import java.util.UUID;

public record CabinetResponse(
        UUID id,
        String nom,
        String specialite,
        String ville,
        String localisation,
        Status status
) {
}
