package com.OS.ClinicOs.user.Services;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AcountService {

    private final UserRepository userrepository;

    public AcountService(UserRepository userrepository) {
        this.userrepository = userrepository;
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Desactiver un compte utilisateur")
    public ResponseEntity<String> deactivateAccount(UUID userId) {
        User user = this.userrepository.findById(userId)
                .orElseThrow(() -> new RessourceNotFoundException("Utilisateur non trouve avec id: " + userId));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le compte est deja desactive.");
        }

        user.setIsActive(false);
        this.userrepository.save(user);

        return ResponseEntity.ok("Compte desactive avec succes.");
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Activer un compte utilisateur")
    public ResponseEntity<String> activateAccount(UUID userId) {
        User user = this.userrepository.findById(userId)
                .orElseThrow(() -> new RessourceNotFoundException("Utilisateur non trouve avec id: " + userId));

        if (Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le compte est deja actif.");
        }

        user.setIsActive(true);
        this.userrepository.save(user);

        return ResponseEntity.ok("Compte active avec succes.");
    }

    // une admin medecin peut cre pleusieur acount


}
