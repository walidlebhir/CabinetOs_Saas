package com.OS.ClinicOs.secretaire.Api;

import com.OS.ClinicOs.secretaire.Dto.AcountRequest;
import com.OS.ClinicOs.secretaire.Dto.SecrutaireRequest;
import com.OS.ClinicOs.secretaire.Dto.SecrutaireResponse;
import com.OS.ClinicOs.secretaire.Dto.UpdateSecrutaireRequest;
import com.OS.ClinicOs.secretaire.Service.SecrutaireService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/Admin/api/secretaire")
public class SecratireAdminController {

    private final SecrutaireService secretaireService;

    public SecratireAdminController(SecrutaireService secretaireService) {
        this.secretaireService = secretaireService;
    }

    @PostMapping("/create")
    public SecrutaireResponse CreateSecretaire(
            @Valid @RequestBody SecrutaireRequest request
    ) {
        return this.secretaireService.CreateNewSecrutaire(request);
    }

    @GetMapping("/{id}")
    public SecrutaireResponse GetSecretaireById(@PathVariable UUID id) {
        return this.secretaireService.GetSecretaireById(id);
    }

    @GetMapping("/all")
    public List<SecrutaireResponse> GetAllSecretaires() {
        return this.secretaireService.GetAllSecretaires();
    }

    @GetMapping("/cabinet/{cabinetId}")
    public List<SecrutaireResponse> GetSecretairesByCabinet(@PathVariable UUID cabinetId) {
        return this.secretaireService.GetSecretairesByCabinet(cabinetId);
    }

    @GetMapping("/search/nom")
    public List<SecrutaireResponse> SearchByNom(@RequestParam String nom) {
        return this.secretaireService.SearchByNom(nom);
    }

    @GetMapping("/search/prenom")
    public List<SecrutaireResponse> SearchByPrenom(@RequestParam String prenom) {
        return this.secretaireService.SearchByPrenom(prenom);
    }

    @GetMapping("/search")
    public List<SecrutaireResponse> SearchByNomAndPrenom(
            @RequestParam String nom,
            @RequestParam String prenom
    ) {
        return this.secretaireService.SearchByNomAndPrenom(nom, prenom);
    }

    @PutMapping("/update")
    public SecrutaireResponse UpdateSecretaire(
            @Valid @RequestBody UpdateSecrutaireRequest request
    ) {
        return this.secretaireService.UpdateSecretaire(request);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> DeleteSecretaire(@PathVariable UUID id) {
        return this.secretaireService.DeleteSecretaire(id);
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<String> RestoreSecretaire(@PathVariable UUID id) {
        return this.secretaireService.RestoreSecretaire(id);
    }

    @PostMapping("/account/create")
    public ResponseEntity<String> CreateSecretaireAccount(
            @Valid @RequestBody AcountRequest request
    ) {
        return this.secretaireService.CreateAcount(request);
    }
}
