package com.OS.ClinicOs.secretaire.Api;

import com.OS.ClinicOs.Security.CurrentSecretaireProvider;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import com.OS.ClinicOs.secretaire.Entity.Secretaire;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Services.AcountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/secretaire/medecins")
public class SecretaireMedecinController {

    private final CurrentSecretaireProvider currentSecretaire ;
    private final MedecinService medecinService ;
    private final MedecinRepository medecinRepository ;
    private final AcountService acountService ;

    public SecretaireMedecinController(
            CurrentSecretaireProvider currentSecretaire ,
            MedecinService medecinService ,
            MedecinRepository medecinRepository ,
            AcountService acountService
    ){
        this.currentSecretaire = currentSecretaire ;
        this.medecinService = medecinService ;
        this.medecinRepository = medecinRepository ;
        this.acountService = acountService ;
    }

    @GetMapping
    @PreAuthorize("hasRole('SECRETAIRE')")
    public List<MedecinResponse> GetMedecinsDeMonCabinet(){
        Secretaire secretaire = this.currentSecretaire.getCurrentSecretaire() ;
        UUID cabinetId = secretaire.getCabinet() != null ? secretaire.getCabinet().getId() : null ;

        if (cabinetId == null){
            throw new PersonnelleException("Aucun cabinet associe a votre compte.") ;
        }

        return this.medecinService.getALlMedecinByCabinet(cabinetId) ;
    }

    @PatchMapping("/{medecinId}/activate")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<String> ActivateMedecinAccount(@PathVariable UUID medecinId){
        Medecin medecin = getScopedMedecin(medecinId) ;
        return this.acountService.activateAccount(medecin.getUser().getId()) ;
    }

    @PatchMapping("/{medecinId}/deactivate")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<String> DeactivateMedecinAccount(@PathVariable UUID medecinId){
        Medecin medecin = getScopedMedecin(medecinId) ;
        return this.acountService.deactivateAccount(medecin.getUser().getId()) ;
    }

    private Medecin getScopedMedecin(UUID medecinId){
        Secretaire secretaire = this.currentSecretaire.getCurrentSecretaire() ;
        UUID cabinetId = secretaire.getCabinet() != null ? secretaire.getCabinet().getId() : null ;

        Medecin medecin = this.medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + medecinId
                )) ;

        if (cabinetId == null
                || medecin.getCabinet() == null
                || !cabinetId.equals(medecin.getCabinet().getId())){
            throw new PersonnelleException("Ce medecin ne fait pas partie de votre cabinet.") ;
        }

        if (medecin.getUser() == null){
            throw new PersonnelleException("Ce medecin n'a pas encore de compte utilisateur.") ;
        }

        return medecin ;
    }
}