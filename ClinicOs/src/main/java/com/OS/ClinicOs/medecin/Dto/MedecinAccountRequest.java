package com.OS.ClinicOs.medecin.Dto;

import java.util.UUID;

public record MedecinAccountRequest(
        UUID medecinId ,
        String email
) {
}
