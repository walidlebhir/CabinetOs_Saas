package com.OS.ClinicOs.home.api;

import com.OS.ClinicOs.home.dto.CabinetDetailResponse;
import com.OS.ClinicOs.home.dto.CabinetHomeResponse;
import com.OS.ClinicOs.home.services.HomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/home")
public class HomeApi {

    private final HomeService homeService ;

    public HomeApi(HomeService homeService){
        this.homeService = homeService ;
    }

    @GetMapping("/cabinets")
    public ResponseEntity<List<CabinetHomeResponse>> getAllCabinets(){
        return ResponseEntity.ok(this.homeService.getAllCabinets()) ;
    }

    @GetMapping("/cabinets/{cabinetId}")
    public ResponseEntity<CabinetDetailResponse> getCabinetWithMedecins(@PathVariable UUID cabinetId){
        return ResponseEntity.ok(this.homeService.getCabinetWithMedecins(cabinetId)) ;
    }
}
