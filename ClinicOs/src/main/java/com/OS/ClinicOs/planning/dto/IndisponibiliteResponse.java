package com.OS.ClinicOs.planning.dto;

import com.OS.ClinicOs.planning.Entity.Enum.TypeIndisponibility;

import java.time.LocalDateTime;
import java.util.UUID;

public record IndisponibiliteResponse(
        Long id ,
        UUID medecinId ,
        String nomMedecin ,
        LocalDateTime dateDebut ,
        LocalDateTime dateFin ,
        String motif ,
        TypeIndisponibility type ,
        LocalDateTime createdAt
) {
}
