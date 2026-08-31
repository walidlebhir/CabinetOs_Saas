package com.OS.ClinicOs.renezvous.dto;

import com.OS.ClinicOs.renezvous.Entity.Enum.Status_RendezVous;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record RendezvousResponse(
        UUID id,
        UUID patientId,
        String nomPatient,
        UUID medecinId,
        String nomMedecin,
        UUID creeParId,
        LocalDate dateRendezvous,
        LocalTime heureDebut,
        LocalTime heureFin,
        Status_RendezVous status,
        String motif
) {
}
