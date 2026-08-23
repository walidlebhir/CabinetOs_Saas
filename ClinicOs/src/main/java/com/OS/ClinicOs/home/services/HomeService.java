package com.OS.ClinicOs.home.services;

import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.home.dto.CabinetDetailResponse;
import com.OS.ClinicOs.home.dto.CabinetHomeResponse;
import com.OS.ClinicOs.home.dto.MedecinDetailResponse;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class HomeService {

    private final CabinetRepository cabinetRepository ;

    public HomeService(CabinetRepository cabinetRepository){
        this.cabinetRepository = cabinetRepository ;
    }

    @Transactional(readOnly = true)
    public List<CabinetHomeResponse> getAllCabinets(){
        return this.cabinetRepository.findAll().stream()
                .map(this::toCabinetHomeResponse)
                .toList() ;
    }

    @Transactional(readOnly = true)
    public CabinetDetailResponse getCabinetWithMedecins(UUID cabinetId){
        Cabinet cabinet = this.cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RessourceNotFoundException("cabinet not found with id : " + cabinetId)) ;
        List<MedecinDetailResponse> medecins = cabinet.getMedecins().stream()
                .map(this::toMedecinDetailResponse)
                .toList() ;
        return new CabinetDetailResponse(
                cabinet.getId() ,
                cabinet.getNom() ,
                cabinet.getSpecialite() ,
                cabinet.getVille() ,
                cabinet.getLocalisation() ,
                cabinet.getStatus() ,
                medecins
        );
    }

    private CabinetHomeResponse toCabinetHomeResponse(Cabinet cabinet){
        return new CabinetHomeResponse(
                cabinet.getId() ,
                cabinet.getNom() ,
                cabinet.getSpecialite() ,
                cabinet.getVille() ,
                cabinet.getLocalisation() ,
                cabinet.getStatus() ,
                cabinet.getMedecins().size()
        );
    }

    private MedecinDetailResponse toMedecinDetailResponse(Medecin medecin){
        return new MedecinDetailResponse(
                medecin.getId() ,
                medecin.getNom() ,
                medecin.getPrenom() ,
                medecin.getSpecialite() ,
                medecin.getNumeroOrder() ,
                medecin.getTeliphone() ,
                medecin.getBiographie() ,
                medecin.getAnneesExperience()
        );
    }
}
