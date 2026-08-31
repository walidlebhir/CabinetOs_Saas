package com.OS.ClinicOs.Security;

import com.OS.ClinicOs.secretaire.Entity.Secretaire;
import com.OS.ClinicOs.secretaire.Repository.SecretaireRepository;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentSecretaireProvider {

    private final UserRepository userRepository ;
    private final SecretaireRepository secretairerepository ;

    public CurrentSecretaireProvider(
            UserRepository userRepository ,
            SecretaireRepository secretairerepository
    ){
        this.userRepository = userRepository ;
        this.secretairerepository = secretairerepository ;
    }

    public Secretaire getCurrentSecretaire(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication() ;

        if (authentication == null || !authentication.isAuthenticated()){
            throw new PersonnelleException("Aucun utilisateur authentifie ") ;
        }

        String email = authentication.getName() ;

        User user = userRepository.findByEmailAndDeletedAtIsNull(email) ;

        if (user == null){
            throw new RessourceNotFoundException("Utilisateur introuvable : " + email) ;
        }

        if (!Role.SECRETAIRE.equals(user.getRole())){
            throw new PersonnelleException("Acces reserve aux secretaires ") ;
        }

        Secretaire secretaire = secretairerepository.findByUser_Email(user.getEmail())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Aucun profil secretaire associe au compte : " + email
                )) ;

        return secretaire ;
    }
}
