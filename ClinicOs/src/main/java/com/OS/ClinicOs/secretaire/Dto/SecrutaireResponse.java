package com.OS.ClinicOs.secretaire.Dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SecrutaireResponse(
        UUID id ,
        String nom ,
        String prenom ,
        String teliphone ,
        String adress ,
        String email ,
        LocalDateTime dateEmbauche
) {
}
