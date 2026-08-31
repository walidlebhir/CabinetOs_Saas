package com.OS.ClinicOs.renezvous.api;

import com.OS.ClinicOs.Security.CurrentMedecinProvider;
import com.OS.ClinicOs.Security.CurrentPatientProvider;
import com.OS.ClinicOs.Security.CurrentSecretaireProvider;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.renezvous.dto.CreneauDisponibiliteResponse;
import com.OS.ClinicOs.renezvous.dto.RendezvousRequest;
import com.OS.ClinicOs.renezvous.dto.RendezvousResponse;
import com.OS.ClinicOs.renezvous.services.RendezvousService;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/rendezvous", "/rendezvous"})
public class RendezvousController {

    private final RendezvousService rendezvousService;
    private final CurrentSecretaireProvider currentSecretaireProvider;
    private final CurrentPatientProvider currentPatientProvider;
    private final CurrentMedecinProvider currentMedecinProvider;
    private final UserRepository userRepository;

    public RendezvousController(
            RendezvousService rendezvousService,
            CurrentSecretaireProvider currentSecretaireProvider,
            CurrentPatientProvider currentPatientProvider,
            CurrentMedecinProvider currentMedecinProvider,
            UserRepository userRepository
    ) {
        this.rendezvousService = rendezvousService;
        this.currentSecretaireProvider = currentSecretaireProvider;
        this.currentPatientProvider = currentPatientProvider;
        this.currentMedecinProvider = currentMedecinProvider;
        this.userRepository = userRepository;
    }

    // =====================================================================
    // Création
    // =====================================================================

    @PostMapping("/secretaire/create")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public RendezvousResponse createParSecretaire(@Valid @RequestBody RendezvousRequest request) {
        return rendezvousService.createRendezvousParSecretaire(
                currentSecretaireProvider.getCurrentSecretaire().getUser(),
                request
        );
    }

    @PostMapping("/patient/create")
    @PreAuthorize("hasRole('PATIENT')")
    public RendezvousResponse createParPatient(@Valid @RequestBody RendezvousRequest request) {
        Patient patient = currentPatientProvider.getCurrentPatient();
        return rendezvousService.createRendezvousParPatient(patient.getUser(), request);
    }

    // =====================================================================
    // Listing des rendez-vous
    // =====================================================================

    @GetMapping("/cabinet/list")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RendezvousResponse> getRdvDuCabinet(
            @RequestParam UUID cabinetId,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.getRdvDuCabinetParAdmin(getCurrentUser(userConect), cabinetId);
    }

    @GetMapping("/secretaire/list")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public List<RendezvousResponse> getRdvDeMonCabinet(
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.getRdvDuCabinetParSecretaire(getCurrentUser(userConect));
    }

    @GetMapping("/medecin/me")
    @PreAuthorize("hasAnyRole('MEDECIN' , 'ADMIN')")
    public List<RendezvousResponse> getMesRdv() {
        Medecin medecin = currentMedecinProvider.getCurrentMedecin();
        return rendezvousService.getRdvDeMonCabinetParMedecin(medecin);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasRole('PATIENT')")
    public List<RendezvousResponse> getMesRdvPatient(
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.getRdvParPatient(
                currentPatientProvider.getCurrentPatient()
        );
    }

    // =====================================================================
    // Actions sur un rendez-vous
    // =====================================================================

    @PatchMapping("/{id}/confirmer")
    @PreAuthorize("hasAnyRole('ADMIN' , 'SECRETAIRE' , 'MEDECIN')")
    public RendezvousResponse confirmer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.confirmerRendezVous(getCurrentUser(userConect), id);
    }

    @PatchMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('ADMIN' , 'SECRETAIRE' , 'MEDECIN')")
    public RendezvousResponse annuler(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.annulerRendezVous(getCurrentUser(userConect), id);
    }

    @PatchMapping("/{id}/terminer")
    @PreAuthorize("hasAnyRole('ADMIN' , 'SECRETAIRE' , 'MEDECIN')")
    public RendezvousResponse terminer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.terminerRendezVous(getCurrentUser(userConect), id);
    }

    @PatchMapping("/{id}/absent")
    @PreAuthorize("hasAnyRole('ADMIN' , 'SECRETAIRE' , 'MEDECIN')")
    public RendezvousResponse absent(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.marquerAbsent(getCurrentUser(userConect), id);
    }

    @PatchMapping("/{id}/attente")
    @PreAuthorize("hasAnyRole('ADMIN' , 'SECRETAIRE' , 'MEDECIN')")
    public RendezvousResponse remettreEnAttente(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userConect
    ) {
        return rendezvousService.remettreEnAttente(getCurrentUser(userConect), id);
    }

    // =====================================================================
    // Disponibilité / créneaux
    // =====================================================================

    @GetMapping("/medecin/{medecinId}/creneaux")
    public List<CreneauDisponibiliteResponse> getCreneaux(
            @PathVariable UUID medecinId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return rendezvousService.getCreneauxDuMedecin(medecinId, date);
    }

    @GetMapping("/available")
    public boolean estLibre(
            @RequestParam UUID medecinId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureFin
    ) {
        return rendezvousService.estCreneauLibre(medecinId, date, heureDebut, heureFin);
    }

    private User getCurrentUser(UserDetails userConect) {
        if (userConect == null) {
            throw new RessourceNotFoundException("Utilisateur introuvable ");
        }
        User user = userRepository.findByEmailAndDeletedAtIsNull(userConect.getUsername());
        if (user == null) {
            throw new RessourceNotFoundException(
                    "Utilisateur introuvable : " + userConect.getUsername()
            );
        }
        return user;
    }
}
