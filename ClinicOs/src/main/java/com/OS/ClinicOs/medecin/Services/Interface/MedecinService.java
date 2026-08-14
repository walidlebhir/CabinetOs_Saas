package com.OS.ClinicOs.medecin.Services.Interface;


import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

/**
 * --> create Medecin
 * --> Update Medecin
 * -->  Delete Medecin
 * -->  Get Medeci
 * --> create Acount medecin (medecin -- user )
 * --> export Medecin
 */


public interface MedecinService {

     public MedecinResponse CreateMedecin(MedecinRequest datamdecin );
     public ResponseEntity<String> UpdateMedecinData(UpdateMedecinRequest data ) ;
     public ResponseEntity<String> deleteMedecin(UUID id );
     public List<MedecinResponse> getALlMedecinByCabinet(UUID cabinet_id);
}
