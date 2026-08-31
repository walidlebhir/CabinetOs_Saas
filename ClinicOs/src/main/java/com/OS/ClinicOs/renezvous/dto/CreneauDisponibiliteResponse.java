package com.OS.ClinicOs.renezvous.dto;

import java.time.LocalTime;

public record CreneauDisponibiliteResponse(
        LocalTime heureDebut,
        LocalTime heureFin,
        boolean libre
) {
}
