package com.OS.ClinicOs.secretaire.Dto;

import java.util.UUID;

public record AcountRequest(
        UUID id_secretaire ,
        String email
) {
}
