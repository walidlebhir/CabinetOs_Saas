package com.OS.ClinicOs.Security;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentMedecinProvider {

    private final UserRepository userRepository ;

    public CurrentMedecinProvider(UserRepository userRepository){
        this.userRepository = userRepository ;
    }

    public Medecin getCurrentMedecin(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication() ;

        if (authentication == null || !authentication.isAuthenticated()){
            throw new PersonnelleException("Aucun utilisateur authentifie ") ;
        }

        String email = authentication.getName() ;

        User user = userRepository.findByEmailAndDeletedAtIsNull(email) ;

        if (user == null){
            throw new RessourceNotFoundException("Utilisateur introuvable : " + email) ;
        }

        if (!Role.MEDECIN.equals(user.getRole()) && !Role.ADMIN.equals(user.getRole())){
            throw new PersonnelleException("Acces reserve aux medecins ") ;
        }

        Medecin medecin = user.getMedecin() ;

        if (medecin == null){
            throw new RessourceNotFoundException("Aucun profil medecin associe au compte : " + email) ;
        }

        return medecin ;
    }
}
