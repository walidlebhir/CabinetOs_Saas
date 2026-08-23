package com.OS.ClinicOs.planning.api;

import com.OS.ClinicOs.planning.dto.IndisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.IndisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateIndisponibiliteRequest;
import com.OS.ClinicOs.planning.services.indisponibiliteservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/planning/indisponibilite")
public class IndisponibiliteController {

    private final indisponibiliteservice indisponibiliteservice ;

    public IndisponibiliteController(
            indisponibiliteservice indisponibiliteservice
    ){
        this.indisponibiliteservice = indisponibiliteservice ;
    }

    @PostMapping("/create")
    public IndisponibiliteResponse CreateIndisponibilite(
            @Valid @RequestBody IndisponibiliteRequest request
    ){
        return this.indisponibiliteservice.createIndisponibilite(request) ;
    }

    @PutMapping("/update")
    public ResponseEntity<String> UpdateIndisponibilite(
            @Valid @RequestBody UpdateIndisponibiliteRequest request
    ){
        return this.indisponibiliteservice.updateIndisponibilite(request) ;
    }

    @GetMapping("/{id}")
    public IndisponibiliteResponse GetIndisponibiliteById(
            @PathVariable Long id
    ){
        return this.indisponibiliteservice.getIndisponibiliteById(id) ;
    }

    @GetMapping("/medecin/{medecinId}")
    public List<IndisponibiliteResponse> GetIndisponibilitesByMedecin(
            @PathVariable UUID medecinId
    ){
        return this.indisponibiliteservice.getIndisponibilitesByMedecin(medecinId) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> DeleteIndisponibilite(
            @PathVariable Long id
    ){
        return this.indisponibiliteservice.deleteIndisponibilite(id) ;
    }
}
