package com.OS.ClinicOs.home.services;

import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.home.dto.CabinetDetailResponse;
import com.OS.ClinicOs.home.dto.CabinetHomeResponse;
import com.OS.ClinicOs.home.dto.MedecinDetailResponse;
import com.OS.ClinicOs.home.dto.MedecinProfilDetailResponse;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import com.OS.ClinicOs.planning.Repository.DisponibiliteRepository;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class HomeService {

    private final CabinetRepository cabinetRepository ;
    private final MedecinRepository medecinRepository ;
    private final DisponibiliteRepository disponibiliteRepository ;

    public HomeService(CabinetRepository cabinetRepository,
                       MedecinRepository medecinRepository,
                       DisponibiliteRepository disponibiliteRepository){
        this.cabinetRepository = cabinetRepository ;
        this.medecinRepository = medecinRepository ;
        this.disponibiliteRepository = disponibiliteRepository ;
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
                cabinet.getMedecins().size() ,
                cabinet.getLatitude() ,
                cabinet.getLongitude()
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

    @Transactional(readOnly = true)
    public MedecinProfilDetailResponse getMedecinProfil(UUID medecinId){
        Medecin medecin = this.medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + medecinId
                ));

        List<MedecinProfilDetailResponse.DisponibiliteMedecinResponse> dispo = this.disponibiliteRepository
                .findByMedecin_Id(medecin.getId())
                .stream()
                .map(this::toDisponibiliteResponse)
                .toList();

        return new MedecinProfilDetailResponse(
                medecin.getId() ,
                medecin.getNom() ,
                medecin.getPrenom() ,
                medecin.getSpecialite() ,
                medecin.getNumeroOrder() ,
                medecin.getTeliphone() ,
                medecin.getBiographie() ,
                medecin.getAnneesExperience() ,
                dispo
        );
    }

    private MedecinProfilDetailResponse.DisponibiliteMedecinResponse toDisponibiliteResponse(Disponibilite_Medcin d){
        return new MedecinProfilDetailResponse.DisponibiliteMedecinResponse(
                d.getId() ,
                d.getJoursemaine() ,
                d.getHeur_debut() ,
                d.getHeur_fin() ,
                d.getDure_creneau() ,
                d.getPause_debut() ,
                d.getPause_fin() ,
                d.getActif()
        );
    }
}
