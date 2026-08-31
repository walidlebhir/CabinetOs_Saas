package com.OS.ClinicOs.cabinet.Services;

import com.OS.ClinicOs.cabinet.Dto.CabinetRequestDto;
import com.OS.ClinicOs.cabinet.Dto.CabinetResponse;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Entity.Enum.Status;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CabinetConfigService {

    private final CabinetRepository cabinetRepository ;
    private final MedecinRepository medecinrepository ;
    private final UserRepository userrepository ;


    public CabinetConfigService(
            CabinetRepository cabinetrepository ,
            MedecinRepository medecinrepository ,
            UserRepository userrepository
    ){
        this.cabinetRepository = cabinetrepository ;
        this.medecinrepository = medecinrepository ;
        this.userrepository = userrepository ;
    }

    // creer un nouveau cabinet pour l'admin connecte
    @Transactional
    public ResponseEntity<String> CreateNewCabinet(CabinetRequestDto datacabinet , UserDetails user_concted ){

        User user = this.getUserConnecte(user_concted);

        Cabinet new_cabinet = Cabinet.builder()
                .nom(datacabinet.nom())
                .ville(datacabinet.ville())
                .status(datacabinet.status())
                .localisation(datacabinet.localisation())
                .specialite(datacabinet.specialite())
                .latitude(datacabinet.latitude())
                .longitude(datacabinet.longitude())
                .admin(user)
                .build();

        if(user.getMedecin() != null && user.getMedecin().getCabinet() == null){
            var medecin = this.medecinrepository.findById(user.getMedecin().getId())
                    .orElse(null);
            if(medecin != null){
                medecin.setCabinet(new_cabinet);
            }
        }

        this.cabinetRepository.save(new_cabinet) ;

        return ResponseEntity.status(HttpStatus.CREATED).body("cabinet cree avec succes ") ;
    }

    // lister les cabinets accessibles au compte connecte :
    // ceux qu'il administre + celui rattache a son profil medecin
    @Transactional(readOnly = true)
    public List<CabinetResponse> getMesCabinets(UserDetails user_conected){
        User user = this.getUserConnecte(user_conected);

        List<Cabinet> cabinets = new ArrayList<>(this.cabinetRepository.findByAdmin_Email(user.getEmail()));

        if(user.getMedecin() != null && user.getMedecin().getCabinet() != null){
            Cabinet rattache = user.getMedecin().getCabinet();
            boolean dejaPresent = cabinets.stream().anyMatch(c -> c.getId().equals(rattache.getId()));
            if(!dejaPresent){
                cabinets.add(rattache);
            }
        }

        return cabinets.stream()
                .map(this::toResponse)
                .toList();
    }

    // consulter un cabinet par son id
    @Transactional(readOnly = true)
    public CabinetResponse getCabinet(UUID cabinetId , UserDetails user_conected){
        Cabinet cabinet = this.getOwnedCabinet(cabinetId , user_conected);
        return this.toResponse(cabinet);
    }

    // mettre a jour la configuration d'un cabinet
    @Transactional
    public ResponseEntity<String> UpdateCabinet(UUID cabinetId , CabinetRequestDto datacabinet , UserDetails user_concted){
        Cabinet cabinet = this.getOwnedCabinet(cabinetId , user_concted);

        cabinet.setNom(datacabinet.nom());
        cabinet.setSpecialite(datacabinet.specialite());
        cabinet.setVille(datacabinet.ville());
        cabinet.setLocalisation(datacabinet.localisation());
        cabinet.setStatus(datacabinet.status());
        cabinet.setLatitude(datacabinet.latitude());
        cabinet.setLongitude(datacabinet.longitude());

        this.cabinetRepository.save(cabinet);

        return ResponseEntity.ok("configuration du cabinet mise a jour avec succes ") ;
    }

    // activer un cabinet
    @Transactional
    public ResponseEntity<String> ActiverCabinet(UUID cabinetId , UserDetails user_conect){
        return this.changerStatus(cabinetId , Status.ACTIF , "cabinet active avec succes " , user_conect);
    }

    // desactiver un cabinet
    @Transactional
    public ResponseEntity<String> DesactiverCabinet(UUID cabinetId , UserDetails user_conect){
        return this.changerStatus(cabinetId , Status.INACTIF , "cabinet desactive avec succes " , user_conect);
    }

    private ResponseEntity<String> changerStatus(UUID cabinetId , Status status , String message , UserDetails user_conect){
        Cabinet cabinet = this.getOwnedCabinet(cabinetId , user_conect);
        cabinet.setStatus(status);
        this.cabinetRepository.save(cabinet);
        return ResponseEntity.ok(message) ;
    }

    private User getUserConnecte(UserDetails user_conected){
        User user = this.userrepository.findByEmailAndDeletedAtIsNull(user_conected.getUsername()) ;
        if(user == null){
            throw new RessourceNotFoundException("user n'existe pas ") ;
        }
        return user ;
    }

    private Cabinet getOwnedCabinet(UUID cabinetId , UserDetails user_conected){
        Cabinet cabinet = this.cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RessourceNotFoundException("cabinet n'existe pas ")) ;

        if(cabinet.getAdmin() == null || !cabinet.getAdmin().getEmail().equals(user_conected.getUsername())){
            throw new RessourceNotFoundException("cabinet n'existe pas pour ce compte ") ;
        }
        return cabinet ;
    }

    private CabinetResponse toResponse(Cabinet cabinet){
        return new CabinetResponse(
                cabinet.getId() ,
                cabinet.getNom() ,
                cabinet.getSpecialite() ,
                cabinet.getVille() ,
                cabinet.getLocalisation() ,
                cabinet.getStatus() ,
                cabinet.getLatitude() ,
                cabinet.getLongitude()
        );
    }
}
