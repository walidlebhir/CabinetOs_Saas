package com.OS.ClinicOs.home.dto;

import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record MedecinProfilDetailResponse(
        UUID id,
        String nom,
        String prenom,
        String specialite,
        String numeroOrder,
        String teliphone,
        String biographie,
        int anneesExperience,
        List<DisponibiliteMedecinResponse> disponibilites
) {

    public record DisponibiliteMedecinResponse(
            Long id,
            Week_Day joursemaine,
            LocalTime heurDebut,
            LocalTime heurFin,
            int dureCreneau,
            LocalTime pauseDebut,
            LocalTime pauseFin,
            Boolean actif
    ) {
    }
}
