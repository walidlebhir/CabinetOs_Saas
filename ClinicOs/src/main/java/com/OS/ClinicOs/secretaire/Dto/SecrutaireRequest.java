package com.OS.ClinicOs.secretaire.Dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SecrutaireRequest(
        String nom  ,
        String prenom ,
        String teliphone ,
        String adress ,
        LocalDateTime dateEmbauche ,
        UUID cabinetId
) {
}
