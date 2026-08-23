package com.OS.ClinicOs.patient.Services;

import com.OS.ClinicOs.patient.Dto.PatientInfoRequest;
import com.OS.ClinicOs.patient.Dto.PatientResponse;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.patient.Repository.PatientRepository;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientrepository;
    private final UserRepository userrepository;

    public PatientService(
            PatientRepository patientrepository,
            UserRepository userrepository
    ){
        this.patientrepository = patientrepository ;
        this.userrepository = userrepository ;
    }

    // ajouter les infos du patient (premiere configuration du compte)
    @Transactional
    public ResponseEntity<String> AjouterInfoPatient(PatientInfoRequest request , UserDetails user_conect){
        Patient patient = this.getPatientConnecte(user_conect);

        if(patient.getDate_naissance() != null || patient.getSex() != null){
            throw new PersonnelleException("Les informations du patient sont deja ajoutees , utilisez la mise a jour") ;
        }

        this.applyInfo(patient , request);
        this.patientrepository.save(patient) ;

        return ResponseEntity.status(HttpStatus.CREATED).body("informations patient ajoutees avec succes ") ;
    }

    // mettre a jour les infos du patient
    @Transactional
    public ResponseEntity<String> UpdateInfoPatient(PatientInfoRequest request , UserDetails user_conect){
        Patient patient = this.getPatientConnecte(user_conect);

        this.applyInfo(patient , request);
        this.patientrepository.save(patient) ;

        return ResponseEntity.ok("informations patient mises a jour avec succes ") ;
    }



    /**
     * @tool methode
     * consulter le profil patient

     */
    public PatientResponse getInfoPatient(UserDetails user_conect){
        Patient patient = this.getPatientConnecte(user_conect);

        return new PatientResponse(
                patient.getId() ,
                patient.getUser().getName() ,
                patient.getUser().getEmail() ,
                patient.getDate_naissance() ,
                patient.getSex() ,
                patient.getGroupe_sanguin() ,
                patient.getAllergie() ,
                patient.getAntecedents() ,
                patient.getAdresse() ,
                patient.getVille()
        );
    }

    private Patient getPatientConnecte(UserDetails user_conect){
        User user = this.userrepository.findByEmailAndDeletedAtIsNull(user_conect.getUsername()) ;
        if(user == null){
            throw new RessourceNotFoundException("user n'existe pas ") ;
        }

        return this.patientrepository.findByUser_EmailAndDeletedAtIsNull(user.getEmail())
                .orElseThrow(() -> new RessourceNotFoundException("patient n'existe pas pour ce compte ")) ;
    }

    private void applyInfo(Patient patient , PatientInfoRequest request){
        patient.setDate_naissance(request.date_naissance());
        patient.setSex(request.sex());
        patient.setGroupe_sanguin(request.groupe_sanguin());
        patient.setAllergie(request.allergie());
        patient.setAntecedents(request.antecedents());
        patient.setAdresse(request.adresse());
        patient.setVille(request.ville());
    }
}
