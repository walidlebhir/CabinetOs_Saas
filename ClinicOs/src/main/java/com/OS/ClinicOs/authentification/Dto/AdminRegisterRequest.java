package com.OS.ClinicOs.authentification.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminRegisterRequest(
        @NotBlank(message = "Le nom est obligatoire")
        @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères")
        String nom,

        @NotBlank(message = "Le prénom est obligatoire")
        @Size(max = 50, message = "Le prénom ne doit pas dépasser 50 caractères")
        String prenom,

        @NotBlank(message = "La spécialité est obligatoire")
        String specialite,

        @NotBlank(message = "Le numéro d'ordre est obligatoire")
        String numeroOrder,

        @NotBlank(message = "Le téléphone est obligatoire")
        @Size(min = 10, max = 20, message = "Le téléphone doit contenir entre 10 et 20 caractères")
        String teliphone,

        @Size(max = 1000, message = "La biographie ne doit pas dépasser 1000 caractères")
        String Biographie,

        @Min(value = 0, message = "Les années d'expérience ne peuvent pas être négatives")
        int annes_experience,

        @NotBlank(message = "Le nom d'utilisateur est obligatoire")
        @Size(min = 2, max = 50, message = "Le nom d'utilisateur doit contenir entre 2 et 50 caractères")
        String name,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "L'email doit être valide")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 6, max = 100, message = "Le mot de passe doit contenir au moins 6 caractères")
        String password
) {
}
