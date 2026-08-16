package com.OS.ClinicOs.medecin.Dto;

import java.util.UUID;

public record MedecinRequest(
        String nom ,
        String prenom ,
        String specialite ,
        String numeroOrder ,
        String teliphone ,
        String biographie ,
        int anneesExperience ,
        UUID cabinetId
) {
}
