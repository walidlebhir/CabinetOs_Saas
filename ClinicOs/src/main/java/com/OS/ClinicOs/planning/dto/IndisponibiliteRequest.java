package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record IndisponibiliteRequest(

        @NotNull(message = "date debut est obligatoire")
        LocalDateTime dateDebut ,

        @NotNull(message = "date fin est obligatoire")
        LocalDateTime dateFin ,

        @Size(max = 255 , message = "le motif ne doit pas depasser 255 caracteres")
        String motif ,

        @NotNull(message = "type est obligatoire")
        TypeIndisponibility type
) {
}
