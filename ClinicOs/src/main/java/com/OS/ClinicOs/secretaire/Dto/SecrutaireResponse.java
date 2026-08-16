package com.OS.ClinicOs.secretaire.Dto;

import java.time.LocalDateTime;

public record SecrutaireResponse(
        String nom ,
        String prenom ,
        String teliphone ,
        String adress ,
        String email ,
        LocalDateTime dateEmbauche
) {
}
