package com.OS.ClinicOs.planning.api;

import com.OS.ClinicOs.planning.dto.DisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.DisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateDisponibiliteRequest;
import com.OS.ClinicOs.planning.services.disponibiliteservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/planning/disponibilite")
public class DisponibiliteController {

    private final disponibiliteservice disponibiliteservice ;

    public DisponibiliteController(
            disponibiliteservice disponibiliteservice
    ){
        this.disponibiliteservice = disponibiliteservice ;
    }

    @PostMapping("/create")
    public DisponibiliteResponse CreateDisponibilite(
            @Valid @RequestBody DisponibiliteRequest request
    ){
        return this.disponibiliteservice.createDisponibilite(request) ;
    }

    @PutMapping("/update")
    public ResponseEntity<String> UpdateDisponibilite(
            @Valid @RequestBody UpdateDisponibiliteRequest request
    ){
        return this.disponibiliteservice.updateDisponibilite(request) ;
    }

    @GetMapping("/{id}")
    public DisponibiliteResponse GetDisponibiliteById(
            @PathVariable Long id
    ){
        return this.disponibiliteservice.getDisponibiliteById(id) ;
    }

    @GetMapping("/medecin/{medecinId}")
    public List<DisponibiliteResponse> GetDisponibilitesByMedecin(
            @PathVariable UUID medecinId
    ){
        return this.disponibiliteservice.getDisponibilitesByMedecin(medecinId) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> DeleteDisponibilite(
            @PathVariable Long id
    ){
        return this.disponibiliteservice.deleteDisponibilite(id) ;
    }
}
