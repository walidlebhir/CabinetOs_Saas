package com.OS.ClinicOs.renezvous.services;


import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.patient.Repository.PatientRepository;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.renezvous.Repository.RendezvousRepository;
import com.OS.ClinicOs.renezvous.dto.RendezvousRequest;

import com.OS.ClinicOs.shared.exception.exception_per.RendezvousDejaReserveException;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class RendezvousService {

    private  final RendezvousRepository rendezvousrepository ;
    private final MedecinRepository medecinRepository ;
    private final UserRepository userrepository ;
    private final PatientRepository patientrepository ;



    public RendezvousService(
            RendezvousRepository rendezvousrepository ,
            MedecinRepository medecinrepository,
            UserRepository userrepository ,
            PatientRepository patientRepository
    ){
        this.medecinRepository = medecinrepository ;
        this.rendezvousrepository = rendezvousrepository ;
        this.userrepository = userrepository ;
        this.patientrepository = patientRepository ;

    }

    /**
    public ResponseEntity<String> CreateNewRendezvous(RendezvousRequest requestdata , String username ){
        try{
            // chercher est ec que date est deja reserver
            Optional<Rendezvous> rendezvous = this.rendezvousrepository.findByDateRendezvous(requestdata.date_rendezvous());
            if(rendezvous.isPresent()){
                Rendezvous rend = rendezvous.get() ;
                if(rend.getHeureDebut().equals(requestdata.heur_debut())){
                    throw new RendezvousDejaReserveException();
                }
            }

            return  null ;
        }catch(DatabaseConnexionException e){
            // debug

            throw new DatabaseConnexionException("data base erreur ")  ;

        }
    }

     **/


}
