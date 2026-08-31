package com.OS.ClinicOs.planning.api;

import com.OS.ClinicOs.Security.CurrentMedecinProvider;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.dto.IndisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.IndisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateIndisponibiliteRequest;
import com.OS.ClinicOs.planning.services.indisponibiliteservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/planning/indisponibilite")
public class IndisponibiliteController {

    private final indisponibiliteservice indisponibiliteservice ;
    private final CurrentMedecinProvider currentMedecinProvider ;

    public IndisponibiliteController(
            indisponibiliteservice indisponibiliteservice ,
            CurrentMedecinProvider currentMedecinProvider
    ){
        this.indisponibiliteservice = indisponibiliteservice ;
        this.currentMedecinProvider = currentMedecinProvider ;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public List<IndisponibiliteResponse> GetMyIndisponibilites(){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.indisponibiliteservice.getIndisponibilitesDuMedecin(medecin) ;
    }

    @PostMapping("/me/create")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public IndisponibiliteResponse CreateMyIndisponibilite(
            @Valid @RequestBody IndisponibiliteRequest request
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.indisponibiliteservice.createIndisponibilite(medecin , request) ;
    }

    @PutMapping("/me/update")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public ResponseEntity<String> UpdateMyIndisponibilite(
            @Valid @RequestBody UpdateIndisponibiliteRequest request
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.indisponibiliteservice.updateIndisponibilite(medecin , request) ;
    }

    @DeleteMapping("/me/delete/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public ResponseEntity<String> DeleteMyIndisponibilite(
            @PathVariable Long id
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.indisponibiliteservice.deleteIndisponibilite(medecin , id) ;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public IndisponibiliteResponse GetIndisponibiliteById(
            @PathVariable Long id
    ){
        return this.indisponibiliteservice.getIndisponibiliteById(id) ;
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<IndisponibiliteResponse> GetIndisponibilitesByMedecin(
            @PathVariable UUID medecinId
    ){
        return this.indisponibiliteservice.getIndisponibilitesByMedecin(medecinId) ;
    }
}
