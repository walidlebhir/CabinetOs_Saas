package com.OS.ClinicOs.medecin.Services.Interface;

import com.OS.ClinicOs.medecin.Dto.MedecinAccountRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountResponse;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public interface MedecinService {

     public MedecinResponse CreateMedecin(MedecinRequest datamdecin );
     public MedecinResponse GetMedecinById(UUID id ) ;
     public ResponseEntity<String> UpdateMedecinData(UpdateMedecinRequest data ) ;
     public ResponseEntity<String> deleteMedecin(UUID id );
     public ResponseEntity<String> restoreMedecin(UUID id );
     public List<MedecinResponse> getALlMedecinByCabinet(UUID cabinet_id);
     public MedecinAccountResponse CreateMedecinAccount(MedecinAccountRequest data ) ;
}
