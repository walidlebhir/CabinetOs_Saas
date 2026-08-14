package com.OS.ClinicOs.cabinet.Dto;

import com.OS.ClinicOs.cabinet.Entity.Enum.Status;
import com.OS.ClinicOs.medecin.Entity.Medecin;

import java.util.List;

public record CabinetResponse(
        String nom ,
        String specialite ,
        String ville ,
        String localisation ,
        Status status

) {
}
