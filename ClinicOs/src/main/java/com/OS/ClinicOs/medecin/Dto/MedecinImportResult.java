package com.OS.ClinicOs.medecin.Dto;

import java.util.List;

public record MedecinImportResult(
        int totalRows,
        int importes,
        List<ErreurLigne> erreurs
) {

    public record ErreurLigne(
            int ligne,
            String message
    ) {
    }
}