package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record DisponibiliteRequest(

        @NotNull(message = "joursemaine est obligatoire")
        Week_Day joursemaine ,

        @NotNull(message = "heur debut est obligatoire")
        LocalTime heurDebut ,

        @NotNull(message = "heur fin est obligatoire")
        LocalTime heurFin ,

        @NotNull(message = "dure creneau est obligatoire")
        @Min(value = 5 , message = "la duree du creneau doit etre au minimum 5 minutes")
        @Max(value = 240 , message = "la duree du creneau doit etre au maximum 240 minutes")
        Integer dureCreneau ,

        LocalTime pauseDebut ,

        LocalTime pauseFin ,

        Boolean actif
) {
}
