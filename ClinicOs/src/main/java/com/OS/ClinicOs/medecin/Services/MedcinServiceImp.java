package com.OS.ClinicOs.medecin.Services;


import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountResponse;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import com.OS.ClinicOs.shared.email.EmailService;
import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.shared.utils.PasswordGenerator;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MedcinServiceImp implements MedecinService {

    private final MedecinRepository medcinrepository ;
    private final UserRepository userrepository ;
    private final CabinetRepository cabinetrepository ;
    private final PasswordEncoder passwordEncoder ;
    private final EmailService emailService ;
    private final PasswordGenerator passwordGenerator ;


    public MedcinServiceImp(
            MedecinRepository medcinrepository ,
            UserRepository userrepository  ,
            CabinetRepository cabinetrepository ,
            PasswordEncoder passwordEncoder ,
            EmailService emailService ,
            PasswordGenerator passwordGenerator
    ){
        this.medcinrepository = medcinrepository ;
        this.userrepository = userrepository ;
        this.cabinetrepository = cabinetrepository ;
        this.passwordEncoder = passwordEncoder ;
        this.emailService = emailService ;
        this.passwordGenerator = passwordGenerator ;
    }


    @Override
    @Transactional
    @Audit(operation = Action.CREATE , description = "Creation d'un nouveau medecin")
    public MedecinResponse CreateMedecin(MedecinRequest datamedecin) {
        try{

            Cabinet cabinet = cabinetrepository.findById(datamedecin.cabinetId())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Cabinet not found with id : " + datamedecin.cabinetId()
                    ));

            if (medcinrepository.existsByNumeroOrderAndDeletedAtIsNull(datamedecin.numeroOrder())){
                throw new AccountExisteException(
                        "Un medecin avec ce numero d'ordre existe deja : " + datamedecin.numeroOrder()
                );
            }

            Medecin new_medecin = Medecin.builder()
                    .nom(datamedecin.nom())
                    .prenom(datamedecin.prenom())
                    .specialite(datamedecin.specialite())
                    .teliphone(datamedecin.teliphone())
                    .numeroOrder(datamedecin.numeroOrder())
                    .biographie(datamedecin.biographie())
                    .anneesExperience(datamedecin.anneesExperience())
                    .cabinet(cabinet)
                    .user(null)
                    .build();

            Medecin saved_medecin = medcinrepository.save(new_medecin) ;
            return mapToResponse(saved_medecin) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Audit(operation = Action.READ , description = "Consultation d'un medecin par son id")
    public MedecinResponse GetMedecinById(UUID id) {
        try{
            Medecin medecin = medcinrepository.findById(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));
            return mapToResponse(medecin) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.UPDATE , description = "Modification des donnees d'un medecin")
    public ResponseEntity<String> UpdateMedecinData(UpdateMedecinRequest data) {
        try{

            Medecin medecin = medcinrepository.findById(data.id())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + data.id()
                    ));

            if (data.nom() != null) medecin.setNom(data.nom());
            if (data.prenom() != null) medecin.setPrenom(data.prenom());
            if (data.specialite() != null) medecin.setSpecialite(data.specialite());
            if (data.numeroOrder() != null) medecin.setNumeroOrder(data.numeroOrder());
            if (data.teliphone() != null) medecin.setTeliphone(data.teliphone());
            if (data.biographie() != null) medecin.setBiographie(data.biographie());
            if (data.anneesExperience() >= 0) medecin.setAnneesExperience(data.anneesExperience());

            medcinrepository.save(medecin) ;
            return ResponseEntity.status(HttpStatus.OK).body("Medecin updated with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.DELETE , description = "Suppression logique d'un medecin")
    public ResponseEntity<String> deleteMedecin(UUID id) {
        try{

            Medecin medecin = medcinrepository.findById(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));

            medecin.setDeletedAt(LocalDateTime.now()) ;
            medcinrepository.save(medecin) ;

            return ResponseEntity.status(HttpStatus.OK).body("Medecin soft-deleted with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.UPDATE , description = "Restauration d'un medecin supprime")
    public ResponseEntity<String> restoreMedecin(UUID id) {
        try{

            Medecin medecin = medcinrepository.findById(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));

            if (!medecin.isDeleted()){
                return ResponseEntity.status(HttpStatus.OK).body("Medecin is not deleted ") ;
            }

            medecin.setDeletedAt(null) ;
            medcinrepository.save(medecin) ;

            return ResponseEntity.status(HttpStatus.OK).body("Medecin restored with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Audit(operation = Action.READ , description = "Liste des medecins d'un cabinet")
    public List<MedecinResponse> getALlMedecinByCabinet(UUID cabinet_id) {
        try{

            return medcinrepository.findByCabinet_Id(cabinet_id)
                    .stream()
                    .map(this::mapToResponse)
                    .toList() ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    public MedecinAccountResponse CreateMedecinAccount(MedecinAccountRequest data) {
        try{

            Medecin medecin = medcinrepository.findById(data.medecinId())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + data.medecinId()
                    ));

            if (medecin.getUser() != null){
                throw new AccountExisteException("Ce medecin a deja un compte utilisateur ") ;
            }

            if (userrepository.findByEmailAndDeletedAtIsNull(data.email()) != null){
                throw new AccountExisteException("Un compte avec cet email existe deja : " + data.email()) ;
            }

            String generatedPassword = passwordGenerator.generateRandomPassword() ;

            User new_user = User.builder()
                    .name(medecin.getNom() + " " + medecin.getPrenom())
                    .email(data.email())
                    .password(passwordEncoder.encode(generatedPassword))
                    .role(Role.MEDECIN)
                    .build();

            User saved_user = userrepository.save(new_user) ;
            medecin.setUser(saved_user) ;
            medcinrepository.save(medecin) ;

            emailService.sendAccountCreatedEmail(
                    saved_user.getEmail() ,
                    saved_user.getName() ,
                    saved_user.getEmail() ,
                    generatedPassword
            );

            return new MedecinAccountResponse(
                    medecin.getId() ,
                    saved_user.getEmail() ,
                    generatedPassword
            ) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    private MedecinResponse mapToResponse(Medecin medecin) {
        return new MedecinResponse(
                medecin.getId() ,
                medecin.getNom() ,
                medecin.getPrenom() ,
                medecin.getSpecialite() ,
                medecin.getNumeroOrder() ,
                medecin.getTeliphone() ,
                medecin.getBiographie() ,
                medecin.getAnneesExperience() ,
                medecin.getUser() != null ? medecin.getUser().getEmail() : null ,
                medecin.getCabinet() != null ? medecin.getCabinet().getId() : null ,
                medecin.getCabinet() != null ? medecin.getCabinet().getNom() : null
        );
    }
}
