package com.OS.ClinicOs.secretaire.Dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateSecrutaireRequest(
        UUID id,
        String nom,
        String prenom,
        String teliphone,
        String adresse,
        LocalDateTime dateEmbauche,
        UUID cabinetId
) {
}
