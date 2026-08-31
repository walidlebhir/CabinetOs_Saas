package com.OS.ClinicOs.secretaire.Service;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.secretaire.Dto.AcountRequest;
import com.OS.ClinicOs.secretaire.Dto.SecrutaireRequest;
import com.OS.ClinicOs.secretaire.Dto.SecrutaireResponse;
import com.OS.ClinicOs.secretaire.Dto.UpdateSecrutaireRequest;
import com.OS.ClinicOs.secretaire.Entity.Secretaire;
import com.OS.ClinicOs.secretaire.Repository.SecretaireRepository;
import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.shared.utils.PasswordGenerator;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SecrutaireService {

    private final SecretaireRepository secretairerepository;
    private final UserRepository userrepository;
    private final CabinetRepository cabinetrepository;
    private final PasswordGenerator passwordgeneration;
    private final PasswordEncoder passwordencoder;

    public SecrutaireService(
            SecretaireRepository secrtetairerepository,
            UserRepository userrepository,
            CabinetRepository cabinetrepository,
            PasswordEncoder passwordencoder,
            PasswordGenerator passwordgenrator
    ) {
        this.secretairerepository = secrtetairerepository;
        this.userrepository = userrepository;
        this.cabinetrepository = cabinetrepository;
        this.passwordencoder = passwordencoder;
        this.passwordgeneration = passwordgenrator;
    }

    private SecrutaireResponse toResponse(Secretaire s) {
        String email = (s.getUser() != null) ? s.getUser().getEmail() : null;
        return new SecrutaireResponse(
                s.getId(),
                s.getNom(),
                s.getPrenom(),
                s.getTeliphone(),
                s.getAdresse(),
                email,
                s.getDateEmbauche()
        );
    }

    @Transactional
    @Audit(operation = Action.CREATE, description = "create new secrutaire")
    public SecrutaireResponse CreateNewSecrutaire(SecrutaireRequest datarequest) {
        Cabinet cabinet = this.cabinetrepository.findById(datarequest.cabinetId())
                .orElseThrow(() -> new RessourceNotFoundException("Cabinet non trouve avec id: " + datarequest.cabinetId()));

        Secretaire secretaire = Secretaire.builder()
                .nom(datarequest.nom())
                .prenom(datarequest.prenom())
                .teliphone(datarequest.teliphone())
                .adresse(datarequest.adress())
                .dateEmbauche(datarequest.dateEmbauche())
                .user(null)
                .cabinet(cabinet)
                .build();

        this.secretairerepository.save(secretaire);
        return toResponse(secretaire);
    }

    @Transactional
    @Audit(operation = Action.CREATE, description = "Ajouter new acount secrutaire")
    public ResponseEntity<String> CreateAcount(AcountRequest dataAcount) {
        Secretaire secteraire = this.secretairerepository.findById(dataAcount.id_secretaire())
                .orElseThrow(() -> new RessourceNotFoundException("Secretaire non trouve avec id: " + dataAcount.id_secretaire()));

        User user = this.userrepository.findByEmailAndDeletedAtIsNull(dataAcount.email());
        if (user != null) {
            throw new AccountExisteException("Ce compte existe deja.");
        }

        User new_user = User.builder()
                .name(secteraire.getNom() + " " + secteraire.getPrenom())
                .email(dataAcount.email())
                .password(this.passwordencoder.encode(this.passwordgeneration.generateRandomPassword()))
                .role(Role.SECRETAIRE)
                .build();

        secteraire.setUser(new_user);

        this.userrepository.save(new_user);
        this.secretairerepository.save(secteraire);

        return ResponseEntity.status(HttpStatus.CREATED).body("Compte cree avec succes.");
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Get secretaire by id")
    public SecrutaireResponse GetSecretaireById(UUID id) {
        Secretaire secretaire = this.secretairerepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Secretaire non trouve avec id: " + id));
        return toResponse(secretaire);
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Consultation du profil de la secretaire connectee")
    public SecrutaireResponse GetMonProfil(Secretaire secretaire) {
        return toResponse(secretaire);
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Get all secretaires")
    public List<SecrutaireResponse> GetAllSecretaires() {
        return this.secretairerepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Get secretaires by cabinet")
    public List<SecrutaireResponse> GetSecretairesByCabinet(UUID cabinetId) {
        return this.secretairerepository.findByCabinet_Id(cabinetId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Search secretaires by nom")
    public List<SecrutaireResponse> SearchByNom(String nom) {
        return this.secretairerepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Search secretaires by prenom")
    public List<SecrutaireResponse> SearchByPrenom(String prenom) {
        return this.secretairerepository.findByPrenomContainingIgnoreCase(prenom).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @Audit(operation = Action.READ, description = "Search secretaires by nom and prenom")
    public List<SecrutaireResponse> SearchByNomAndPrenom(String nom, String prenom) {
        return this.secretairerepository.findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(nom, prenom).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Update secretaire data")
    public SecrutaireResponse UpdateSecretaire(UpdateSecrutaireRequest request) {
        Secretaire secretaire = this.secretairerepository.findById(request.id())
                .orElseThrow(() -> new RessourceNotFoundException("Secretaire non trouve avec id: " + request.id()));

        if (request.nom() != null) {
            secretaire.setNom(request.nom());
        }
        if (request.prenom() != null) {
            secretaire.setPrenom(request.prenom());
        }
        if (request.teliphone() != null) {
            secretaire.setTeliphone(request.teliphone());
        }
        if (request.adresse() != null) {
            secretaire.setAdresse(request.adresse());
        }
        if (request.dateEmbauche() != null) {
            secretaire.setDateEmbauche(request.dateEmbauche());
        }
        if (request.cabinetId() != null) {
            Cabinet cabinet = this.cabinetrepository.findById(request.cabinetId())
                    .orElseThrow(() -> new RessourceNotFoundException("Cabinet non trouve avec id: " + request.cabinetId()));
            secretaire.setCabinet(cabinet);
        }

        this.secretairerepository.save(secretaire);
        return toResponse(secretaire);
    }

    @Transactional
    @Audit(operation = Action.DELETE, description = "Soft delete secretaire")
    public ResponseEntity<String> DeleteSecretaire(UUID id) {
        Secretaire secretaire = this.secretairerepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Secretaire non trouve avec id: " + id));

        secretaire.setDeletedAt(LocalDateTime.now());
        this.secretairerepository.save(secretaire);

        return ResponseEntity.ok("Secretaire supprime avec succes.");
    }


    @Transactional
    @Audit(operation = Action.UPDATE, description = "Restore soft deleted secretaire")
    public ResponseEntity<String> RestoreSecretaire(UUID id) {
        Secretaire secretaire = this.secretairerepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Secretaire non trouve avec id: " + id));

        secretaire.setDeletedAt(null);
        this.secretairerepository.save(secretaire);

        return ResponseEntity.ok("Secretaire restaure avec succes.");
    }
}
