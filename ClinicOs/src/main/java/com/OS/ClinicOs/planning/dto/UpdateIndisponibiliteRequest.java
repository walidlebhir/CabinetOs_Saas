package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateIndisponibiliteRequest(

        @NotNull(message = "id de l'indisponibilite est obligatoire")
        Long id ,

        @NotNull(message = "medecinId est obligatoire")
        UUID medecinId ,

        LocalDateTime dateDebut ,

        LocalDateTime dateFin ,

        @Size(max = 255 , message = "le motif ne doit pas depasser 255 caracteres")
        String motif ,

        TypeIndisponibility type
) {
}
