package com.OS.ClinicOs.renezvous.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record RendezvousRequest(
    UUID id_patient ,
    UUID id_medecin ,
    LocalDate date_rendezvous ,
    LocalTime heur_debut ,
    LocalTime heur_fin,
    String motif
) {
}
