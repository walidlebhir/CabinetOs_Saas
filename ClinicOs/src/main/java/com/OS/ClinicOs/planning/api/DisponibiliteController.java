package com.OS.ClinicOs.planning.api;

import com.OS.ClinicOs.Security.CurrentMedecinProvider;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.dto.DisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.DisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateDisponibiliteRequest;
import com.OS.ClinicOs.planning.services.disponibiliteservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/planning/disponibilite")
public class DisponibiliteController {

    private final disponibiliteservice disponibiliteservice ;
    private final CurrentMedecinProvider currentMedecinProvider ;

    public DisponibiliteController(
            disponibiliteservice disponibiliteservice ,
            CurrentMedecinProvider currentMedecinProvider
    ){
        this.disponibiliteservice = disponibiliteservice ;
        this.currentMedecinProvider = currentMedecinProvider ;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public List<DisponibiliteResponse> GetMyDisponibilites(){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.disponibiliteservice.getDisponibilitesDuMedecin(medecin) ;
    }

    @PostMapping("/me/create")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public DisponibiliteResponse CreateMyDisponibilite(
            @Valid @RequestBody DisponibiliteRequest request
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.disponibiliteservice.createDisponibilite(medecin , request) ;
    }

    @PutMapping("/me/update")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public ResponseEntity<String> UpdateMyDisponibilite(
            @Valid @RequestBody UpdateDisponibiliteRequest request
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.disponibiliteservice.updateDisponibilite(medecin , request) ;
    }

    @DeleteMapping("/me/delete/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public ResponseEntity<String> DeleteMyDisponibilite(
            @PathVariable Long id
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.disponibiliteservice.deleteDisponibilite(medecin , id) ;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DisponibiliteResponse GetDisponibiliteById(
            @PathVariable Long id
    ){
        return this.disponibiliteservice.getDisponibiliteById(id) ;
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DisponibiliteResponse> GetDisponibilitesByMedecin(
            @PathVariable UUID medecinId
    ){
        return this.disponibiliteservice.getDisponibilitesByMedecin(medecinId) ;
    }
}
