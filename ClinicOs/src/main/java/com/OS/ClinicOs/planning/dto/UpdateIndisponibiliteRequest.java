package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record UpdateIndisponibiliteRequest(

        @NotNull(message = "id de l'indisponibilite est obligatoire")
        Long id ,

        LocalDateTime dateDebut ,

        LocalDateTime dateFin ,

        @Size(max = 255 , message = "le motif ne doit pas depasser 255 caracteres")
        String motif ,

        TypeIndisponibility type
) {
}
