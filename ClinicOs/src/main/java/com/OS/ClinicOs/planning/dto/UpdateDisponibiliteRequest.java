package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;
import java.util.UUID;

public record UpdateDisponibiliteRequest(

        @NotNull(message = "id de la disponibilite est obligatoire")
        Long id ,

        @NotNull(message = "medecinId est obligatoire")
        UUID medecinId ,

        Week_Day joursemaine ,

        LocalTime heurDebut ,

        LocalTime heurFin ,

        @Min(value = 5 , message = "la duree du creneau doit etre au minimum 5 minutes")
        @Max(value = 240 , message = "la duree du creneau doit etre au maximum 240 minutes")
        Integer dureCreneau ,

        LocalTime pauseDebut ,

        LocalTime pauseFin ,

        Boolean actif
) {
}
