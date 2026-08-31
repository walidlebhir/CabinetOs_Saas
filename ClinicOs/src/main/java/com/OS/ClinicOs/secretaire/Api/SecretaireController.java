package com.OS.ClinicOs.secretaire.Api;

import com.OS.ClinicOs.Security.CurrentSecretaireProvider;
import com.OS.ClinicOs.secretaire.Dto.SecrutaireResponse;
import com.OS.ClinicOs.secretaire.Entity.Secretaire;
import com.OS.ClinicOs.secretaire.Service.SecrutaireService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secretaire")
public class SecretaireController {

    private final CurrentSecretaireProvider currentSecretaire ;
    private final SecrutaireService secretaireService ;

    public SecretaireController(
            CurrentSecretaireProvider currentSecretaire ,
            SecrutaireService secretaireService
    ){
        this.currentSecretaire = currentSecretaire ;
        this.secretaireService = secretaireService ;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public SecrutaireResponse GetMonProfil(){
        Secretaire secretaire = this.currentSecretaire.getCurrentSecretaire() ;
        return this.secretaireService.GetMonProfil(secretaire) ;
    }
}
