package com.OS.ClinicOs.planning.api;

import com.OS.ClinicOs.Security.CurrentMedecinProvider;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.dto.PlanningRequest;
import com.OS.ClinicOs.planning.dto.PlanningResponse;
import com.OS.ClinicOs.planning.services.planningservice;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/planning")
public class PlanningController {

    private final planningservice planningservice ;
    private final CurrentMedecinProvider currentMedecinProvider ;

    public PlanningController(
            planningservice planningservice ,
            CurrentMedecinProvider currentMedecinProvider
    ){
        this.planningservice = planningservice ;
        this.currentMedecinProvider = currentMedecinProvider ;
    }

    @PostMapping("/me/create")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public PlanningResponse CreateMyPlanning(
            @Valid @RequestBody PlanningRequest request
    ){
        Medecin medecin = this.currentMedecinProvider.getCurrentMedecin() ;
        return this.planningservice.createPlanning(medecin , request) ;
    }
}
