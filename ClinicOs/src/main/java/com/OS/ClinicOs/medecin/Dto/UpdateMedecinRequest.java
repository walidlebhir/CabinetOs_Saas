package com.OS.ClinicOs.medecin.Dto;

import java.util.UUID;

public record UpdateMedecinRequest(
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
