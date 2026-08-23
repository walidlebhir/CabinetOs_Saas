package com.OS.ClinicOs.patient.Dto;

import com.OS.ClinicOs.patient.Entity.Enum.SEX;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PatientInfoRequest(
        @NotNull(message = "La date de naissance est obligatoire")
        @Past(message = "La date de naissance doit etre dans le passe")
        LocalDate date_naissance,

        @NotNull(message = "Le sexe est obligatoire")
        SEX sex,

        @NotBlank(message = "Le groupe sanguin est obligatoire")
        @Size(max = 5, message = "Le groupe sanguin doit contenir au maximum 5 caracteres")
        String groupe_sanguin,

        @Size(max = 500, message = "Les allergies doivent contenir au maximum 500 caracteres")
        String allergie,

        @Size(max = 1000, message = "Les antecedents doivent contenir au maximum 1000 caracteres")
        String antecedents,

        @NotBlank(message = "L'adresse est obligatoire")
        @Size(min = 2, max = 200, message = "L'adresse doit contenir entre 2 et 200 caracteres")
        String adresse,

        @NotBlank(message = "La ville est obligatoire")
        @Size(min = 2, max = 100, message = "La ville doit contenir entre 2 et 100 caracteres")
        String ville
) {
}
