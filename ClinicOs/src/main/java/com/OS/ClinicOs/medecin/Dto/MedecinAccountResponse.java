package com.OS.ClinicOs.medecin.Dto;

import java.util.UUID;

public record MedecinAccountResponse(
        UUID medecinId ,
        String email ,
        String generatedPassword
) {
}
