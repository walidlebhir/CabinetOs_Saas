package com.OS.ClinicOs.cabinet.Services;

import com.OS.ClinicOs.cabinet.Dto.CabinetRequestDto;
import com.OS.ClinicOs.cabinet.Dto.CabinetResponse;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CabinetConfigService {
    private final CabinetRepository cabinetRepository ;
    private  final MedecinRepository medecinrepository ;
    private  final UserRepository userrepository ;


    public CabinetConfigService(
            CabinetRepository cabinetrepository ,
            MedecinRepository medecinrepository ,
            UserRepository userrepository
    ){
        this.cabinetRepository = cabinetrepository ;
        this.medecinrepository = medecinrepository ;
        this.userrepository = userrepository ;
    }

    // create new configuration
    @Transactional
    public ResponseEntity<String> CreateNewCabinet(CabinetRequestDto datacabinet , UserDetails user_concted ){
        try{
            User user = this.userrepository.findByEmailAndDeletedAtIsNull(user_concted.getUsername()) ;
            Cabinet new_cabinet = Cabinet.builder()
                    .nom(datacabinet.nom())
                    .ville(datacabinet.ville())
                    .status(datacabinet.status())
                    .localisation(datacabinet.localisation())
                    .specialite(datacabinet.specialite())
                    .build();
            Medecin medecin = this.medecinrepository.findById(
                    user.getMedecin().getId()
            ).orElseThrow(()-> new UsernameNotFoundException("Medcin not found "));
            medecin.setCabinet(new_cabinet);
            this.cabinetRepository.save(new_cabinet) ;
            this.medecinrepository.save(medecin) ;
            return ResponseEntity.status(HttpStatus.CREATED).body("cabinet created with succes ") ;

        }catch(DatabaseConnexionException e ){
            // debug
            System.out.println("Problemme dans la conection de db : "+e.getMessage()) ;
            throw new DatabaseConnexionException("data base problemme ") ;

        }
    }

    // show Cabinet
    public CabinetResponse getcabinet(UserDetails user_conected ){
        try{
            User user = this.userrepository.findByEmailAndDeletedAtIsNull(user_conected.getUsername()) ;
            Cabinet cabinet = user.getMedecin().getCabinet();
            return  new CabinetResponse(
                    cabinet.getNom() ,
                    cabinet.getSpecialite() ,
                    cabinet.getVille() ,
                    cabinet.getLocalisation() ,
                    cabinet.getStatus()
            );

        }catch(DatabaseConnexionException e ){
            // debug
            System.out.println("problemme dans database "+e.getMessage()) ;
            throw  new DatabaseConnexionException("database problemme of conection " );

        }
    }

    // update config Cabinet





}
