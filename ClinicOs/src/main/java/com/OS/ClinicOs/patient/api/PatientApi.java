package com.OS.ClinicOs.patient.APi;

import com.OS.ClinicOs.patient.Dto.PatientInfoRequest;
import com.OS.ClinicOs.patient.Dto.PatientResponse;
import com.OS.ClinicOs.patient.Services.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/patient", "/patient"})
public class PatientApi {

    private final PatientService patientservice ;

    public PatientApi(
            PatientService patientservice
    ){
        this.patientservice = patientservice ;
    }

    @PostMapping("/info/add")
    public ResponseEntity<String> AjouterInfo(
            @Valid @RequestBody PatientInfoRequest patientinfo ,
            @AuthenticationPrincipal UserDetails user_conect
    ){
        return this.patientservice.AjouterInfoPatient(patientinfo , user_conect) ;
    }

    @PutMapping("/info/update")
    public ResponseEntity<String> UpdateInfo(
            @Valid @RequestBody PatientInfoRequest patientinfo ,
            @AuthenticationPrincipal UserDetails user_conect
    ){
        return this.patientservice.UpdateInfoPatient(patientinfo , user_conect) ;
    }

    @GetMapping("/info")
    public PatientResponse GetInfo(
            @AuthenticationPrincipal UserDetails user_conect
    ){
        return this.patientservice.getInfoPatient(user_conect) ;
    }
}
