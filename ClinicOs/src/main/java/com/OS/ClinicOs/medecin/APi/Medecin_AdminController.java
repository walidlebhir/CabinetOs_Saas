package com.OS.ClinicOs.medecin.APi;

import com.OS.ClinicOs.medecin.Dto.MedecinAccountRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountResponse;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/Admin/api/medecin")
public class Medecin_AdminController {

    private final MedecinService medecinService ;

    public Medecin_AdminController(
            MedecinService medecinService
    ){
        this.medecinService = medecinService ;
    }

    @PostMapping("/create")
    public MedecinResponse CreateMedecin(
            @Valid @RequestBody MedecinRequest request
    ){
        return this.medecinService.CreateMedecin(request) ;
    }

    @GetMapping("/{id}")
    public MedecinResponse GetMedecinById(
            @PathVariable UUID id
    ){
        return this.medecinService.GetMedecinById(id) ;
    }

    @PutMapping("/update")
    public ResponseEntity<String> UpdateMedecin(
            @Valid @RequestBody UpdateMedecinRequest request
    ){
        return this.medecinService.UpdateMedecinData(request) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> DeleteMedecin(
            @PathVariable UUID id
    ){
        return this.medecinService.deleteMedecin(id) ;
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<String> RestoreMedecin(
            @PathVariable UUID id
    ){
        return this.medecinService.restoreMedecin(id) ;
    }

    @GetMapping("/cabinet/{cabinetId}")
    public List<MedecinResponse> GetAllMedecinByCabinet(
            @PathVariable UUID cabinetId
    ){
        return this.medecinService.getALlMedecinByCabinet(cabinetId) ;
    }

    @PostMapping("/account/create")
    public MedecinAccountResponse CreateMedecinAccount(
            @Valid @RequestBody MedecinAccountRequest request
    ){
        return this.medecinService.CreateMedecinAccount(request) ;
    }
}
