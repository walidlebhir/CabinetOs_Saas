package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public record DisponibiliteResponse(
        Long id ,
        UUID medecinId ,
        String nomMedecin ,
        Week_Day joursemaine ,
        LocalTime heurDebut ,
        LocalTime heurFin ,
        int dureCreneau ,
        LocalTime pauseDebut ,
        LocalTime pauseFin ,
        Boolean actif ,
        LocalDateTime createdAt
) {
}
