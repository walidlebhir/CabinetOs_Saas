package com.OS.ClinicOs.medecin.APi;

import com.OS.ClinicOs.Security.CurrentMedecinProvider;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medecin")
public class MedecinController {

    private final CurrentMedecinProvider currentMedecin ;
    private final MedecinService medecinService ;

    public MedecinController(
            CurrentMedecinProvider currentMedecin ,
            MedecinService medecinService
    ){
        this.currentMedecin = currentMedecin ;
        this.medecinService = medecinService ;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public MedecinResponse GetMonProfil(){
        Medecin medecin = this.currentMedecin.getCurrentMedecin() ;
        return this.medecinService.GetMonProfil(medecin) ;
    }
}
