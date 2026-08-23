package com.OS.ClinicOs.home.dto;

import java.util.UUID;

public record MedecinDetailResponse(
        UUID id ,
        String nom ,
        String prenom ,
        String specialite ,
        String numeroOrder ,
        String teliphone ,
        String biographie ,
        int anneesExperience
) {
}
