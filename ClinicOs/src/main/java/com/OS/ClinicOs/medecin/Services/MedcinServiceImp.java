package com.OS.ClinicOs.medecin.Services;


import com.OS.ClinicOs.cabinet.Dto.CabinetResponse;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MedcinServiceImp implements MedecinService {

    private final MedecinRepository medcinrepository ;
    private final UserRepository userrepository ;
    private final CabinetRepository cabinetrepository ;


    public MedcinServiceImp(
            MedecinRepository medcinrepository ,
            UserRepository userrepository  ,
            CabinetRepository cabinetrepository
    ){
        this.medcinrepository = medcinrepository ;
        this.userrepository = userrepository ;
        this.cabinetrepository = cabinetrepository ;
    }


    @Override
    public MedecinResponse CreateMedecin(MedecinRequest datamdecin) {
        try{

        }catch (DatabaseConnexionException e){
            // debug
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");

        }
    }

    @Override
    public ResponseEntity<String> UpdateMedecinData(UpdateMedecinRequest data) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteMedecin(UUID id) {
        return null;
    }

    @Override
    public List<MedecinResponse> getALlMedecinByCabinet(UUID cabinet_id) {
        return List.of();
    }
}
