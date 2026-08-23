package com.OS.ClinicOs.cabinet.Dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CabinetRequestDto(
        @NotBlank(message = "Le nom du cabinet est obligatoire")
        @Size(min = 2, max = 100, message = "Le nom du cabinet doit contenir entre 2 et 100 caracteres")
        String nom,

        @NotBlank(message = "La specialite est obligatoire")
        @Size(min = 2, max = 100, message = "La specialite doit contenir entre 2 et 100 caracteres")
        String specialite,

        @NotBlank(message = "La ville est obligatoire")
        @Size(min = 2, max = 100, message = "La ville doit contenir entre 2 et 100 caracteres")
        String ville,

        @NotNull(message = "Le statut est obligatoire")
        Status status,

        @Size(max = 200, message = "La localisation doit contenir au maximum 200 caracteres")
        String localisation
) {
}
