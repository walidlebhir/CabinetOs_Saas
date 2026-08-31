package com.OS.ClinicOs.renezvous.services;


import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.patient.Repository.PatientRepository;
import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import com.OS.ClinicOs.planning.Entity.Indisponibilite;
import com.OS.ClinicOs.planning.Repository.DisponibiliteRepository;
import com.OS.ClinicOs.planning.Repository.Indesponibilitrepository;
import com.OS.ClinicOs.renezvous.Entity.Enum.Status_RendezVous;
import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import com.OS.ClinicOs.renezvous.Repository.RendezvousRepository;
import com.OS.ClinicOs.renezvous.dto.CreneauDisponibiliteResponse;
import com.OS.ClinicOs.renezvous.dto.RendezvousRequest;
import com.OS.ClinicOs.renezvous.dto.RendezvousResponse;
import com.OS.ClinicOs.secretaire.Repository.SecretaireRepository;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RendezvousDejaReserveException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RendezvousService {

    private final RendezvousRepository rendezvousrepository;
    private final MedecinRepository medecinRepository;
    private final UserRepository userrepository;
    private final PatientRepository patientrepository;
    private final DisponibiliteRepository disponibiliteRepository;
    private final Indesponibilitrepository indesponibilitrepository;
    private final CabinetRepository cabinetRepository;
    private final SecretaireRepository secretaireRepository;

    public RendezvousService(
            RendezvousRepository rendezvousrepository,
            MedecinRepository medecinrepository,
            UserRepository userrepository,
            PatientRepository patientRepository,
            DisponibiliteRepository disponibiliteRepository,
            Indesponibilitrepository indesponibilitrepository,
            CabinetRepository cabinetRepository,
            SecretaireRepository secretaireRepository
    ) {
        this.medecinRepository = medecinrepository;
        this.rendezvousrepository = rendezvousrepository;
        this.userrepository = userrepository;
        this.patientrepository = patientRepository;
        this.disponibiliteRepository = disponibiliteRepository;
        this.indesponibilitrepository = indesponibilitrepository;
        this.cabinetRepository = cabinetRepository;
        this.secretaireRepository = secretaireRepository;
    }

    // =====================================================================
    // Création d'un rendez-vous par la secrétaire (pour un patient)
    // =====================================================================

    @Transactional
    @Audit(operation = Action.CREATE, description = "Creation d'un rendezvous par la secretaire")
    public RendezvousResponse createRendezvousParSecretaire(User creePar, RendezvousRequest request) {
        Patient patient = patientrepository.findById(request.id_patient())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Patient introuvable avec l'id : " + request.id_patient()
                ));

        Medecin medecin = medecinRepository.findById(request.id_medecin())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + request.id_medecin()
                ));

        verifierCreneauDisponible(medecin, request.date_rendezvous(), request.heur_debut(), request.heur_fin());

        Rendezvous rendezvous = Rendezvous.builder()
                .patient(patient)
                .medecin(medecin)
                .creePar(creePar)
                .dateRendezvous(request.date_rendezvous())
                .heureDebut(request.heur_debut())
                .heureFin(request.heur_fin())
                .status(Status_RendezVous.EN_ATTENTE)
                .motif(request.motif())
                .build();

        return mapToResponse(rendezvousrepository.save(rendezvous));
    }

    // =====================================================================
    // Création d'un rendez-vous par le patient connecté (compte)
    // =====================================================================

    @Transactional
    @Audit(operation = Action.CREATE, description = "Creation d'un rendezvous par le patient")
    public RendezvousResponse createRendezvousParPatient(User patientUser, RendezvousRequest request) {
        Patient patient = patientrepository.findByUser_EmailAndDeletedAtIsNull(patientUser.getEmail())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Aucun profil patient associe au compte : " + patientUser.getEmail()
                ));

        Medecin medecin = medecinRepository.findById(request.id_medecin())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + request.id_medecin()
                ));

        verifierCreneauDisponible(medecin, request.date_rendezvous(), request.heur_debut(), request.heur_fin());

        Rendezvous rendezvous = Rendezvous.builder()
                .patient(patient)
                .medecin(medecin)
                .creePar(patientUser)
                .dateRendezvous(request.date_rendezvous())
                .heureDebut(request.heur_debut())
                .heureFin(request.heur_fin())
                .status(Status_RendezVous.EN_ATTENTE)
                .motif(request.motif())
                .build();

        return mapToResponse(rendezvousrepository.save(rendezvous));
    }

    // =====================================================================
    // Vérification de la disponibilité d'un créneau précis
    // =====================================================================

    public boolean estCreneauLibre(UUID medecinId, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        Medecin medecin = getMedecin(medecinId);
        return !estCreneauOccupe(medecin, date, heureDebut, heureFin);
    }

    // =====================================================================
    // Liste des créneaux libres / réservés d'un médecin pour une date
    // =====================================================================

    @Audit(operation = Action.READ, description = "Consultation des creneaux libres et reserves d'un medecin")
    public List<CreneauDisponibiliteResponse> getCreneauxDuMedecin(UUID medecinId, LocalDate date) {
        Medecin medecin = getMedecin(medecinId);

        List<Disponibilite_Medcin> plages = disponibiliteRepository
                .findByMedecin_IdAndJoursemaine(medecin.getId(), convertirEnJour(date));

        List<CreneauDisponibiliteResponse> resultat = new ArrayList<>();

        for (Disponibilite_Medcin plage : plages) {
            if (Boolean.FALSE.equals(plage.getActif())) {
                continue;
            }

            int duree = plage.getDure_creneau() > 0 ? plage.getDure_creneau() : 30;
            LocalTime debut = plage.getHeur_debut();
            LocalTime fin = plage.getHeur_fin();

            while (debut.isBefore(fin)) {
                LocalTime finCreneau = debut.plusMinutes(duree);
                if (finCreneau.isAfter(fin)) {
                    finCreneau = fin;
                }

                boolean dansPause = estDansPause(debut, finCreneau, plage);

                boolean occupe = false;
                if (!dansPause) {
                    occupe = estCreneauOccupe(medecin, date, debut, finCreneau);
                }

                resultat.add(new CreneauDisponibiliteResponse(
                        debut,
                        finCreneau,
                        !dansPause && !occupe
                ));

                debut = finCreneau;
            }
        }

        return resultat;
    }

    // =====================================================================
    // Recuperation des rendez-vous
    // =====================================================================

    @Transactional
    public List<Rendezvous> getALlRendezVousCabinet(UUID medecin_id) {
        Medecin medecin = medecinRepository.findById(medecin_id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + medecin_id
                ));

        return rendezvousrepository.findAllByMedecin(medecin);
    }

    // =====================================================================
    // Rendez-vous du cabinet (admin-cabinet connecté)
    // =====================================================================

    @Audit(operation = Action.READ, description = "Listing des rendezvous du cabinet par l'admin")
    public List<RendezvousResponse> getRdvDuCabinetParAdmin(User adminUser, UUID cabinetId) {
        Cabinet cabinet = getCabinet(adminUser, cabinetId);
        return mapToListe(rendezvousrepository.findAllByMedecin_Cabinet_Id(cabinet.getId()));
    }

    // =====================================================================
    // Rendez-vous du cabinet (secrétaire connectée)
    // =====================================================================

    @Audit(operation = Action.READ, description = "Listing des rendezvous du cabinet par la secretaire")
    public List<RendezvousResponse> getRdvDuCabinetParSecretaire(User secretaireUser) {
        Cabinet cabinet = secretaireRepository.findByUser_Email(secretaireUser.getEmail())
                .map(sc -> sc.getCabinet())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Aucun cabinet associe a ce compte secretaire"
                ));
        return mapToListe(rendezvousrepository.findAllByMedecin_Cabinet_Id(cabinet.getId()));
    }

    // =====================================================================
    // Rendez-vous du médecin connecté
    // =====================================================================

    @Audit(operation = Action.READ, description = "Listing des rendezvous du medecin connecte")
    public List<RendezvousResponse> getRdvDeMonCabinetParMedecin(Medecin medecin) {
        return mapToListe(rendezvousrepository.findAllByMedecin(medecin));
    }

    // =====================================================================
    // Rendez-vous du patient connecté
    // =====================================================================

    @Audit(operation = Action.READ, description = "Listing des rendezvous du patient connecte")
    public List<RendezvousResponse> getRdvParPatient(Patient patient) {
        return mapToListe(rendezvousrepository.findAllByPatient(patient));
    }

    // =====================================================================
    // Actions sur un rendez-vous (scoping par rôle)
    // =====================================================================

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Confirmation d'un rendezvous")
    public RendezvousResponse confirmerRendezVous(User acteur, UUID id) {
        return changerStatut(acteur, id, Status_RendezVous.CONFIRME);
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Annulation d'un rendezvous")
    public RendezvousResponse annulerRendezVous(User acteur, UUID id) {
        return changerStatut(acteur, id, Status_RendezVous.ANNULE);
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Cloture d'un rendezvous")
    public RendezvousResponse terminerRendezVous(User acteur, UUID id) {
        return changerStatut(acteur, id, Status_RendezVous.TERMINE);
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Marquer un patient comme absent")
    public RendezvousResponse marquerAbsent(User acteur, UUID id) {
        return changerStatut(acteur, id, Status_RendezVous.ABSENT);
    }

    @Transactional
    @Audit(operation = Action.UPDATE, description = "Remise en attente d'un rendezvous")
    public RendezvousResponse remettreEnAttente(User acteur, UUID id) {
        return changerStatut(acteur, id, Status_RendezVous.EN_ATTENTE);
    }

    private RendezvousResponse changerStatut(User acteur, UUID id, Status_RendezVous nouveauStatut) {
        Rendezvous rdv = rendezvousrepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Rendezvous introuvable avec l'id : " + id
                ));

        verifierAccesRdv(acteur, rdv);

        rdv.setStatus(nouveauStatut);
        return mapToResponse(rendezvousrepository.save(rdv));
    }

    private void verifierAccesRdv(User acteur, Rendezvous rdv) {
        if (acteur == null) {
            throw new PersonnelleException("Aucun utilisateur authentifie ");
        }

        if (Role.ADMIN.equals(acteur.getRole())) {
            if (rdv.getMedecin() == null || rdv.getMedecin().getCabinet() == null) {
                throw new PersonnelleException("Ce rendezvous n'a pas de medecin associe ");
            }
            Cabinet cabinet = cabinetRepository.findById(rdv.getMedecin().getCabinet().getId())
                    .orElseThrow(() -> new RessourceNotFoundException("Cabinet introuvable"));
            if (cabinet.getAdmin() == null
                    || !cabinet.getAdmin().getId().equals(acteur.getId())) {
                throw new PersonnelleException("Ce rendezvous ne fait pas partie de votre cabinet ");
            }
            return;
        }

        if (Role.MEDECIN.equals(acteur.getRole())) {
            Medecin medecin = acteur.getMedecin();
            if (medecin == null || !medecin.getId().equals(rdv.getMedecin().getId())) {
                throw new PersonnelleException("Ce rendezvous ne vous appartient pas ");
            }
            return;
        }

        if (Role.SECRETAIRE.equals(acteur.getRole())) {
            Cabinet cabinetSecretaire = secretaireRepository.findByUser_Email(acteur.getEmail())
                    .map(sc -> sc.getCabinet())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Aucun cabinet associe a ce compte secretaire"
                    ));
            if (rdv.getMedecin() == null || rdv.getMedecin().getCabinet() == null) {
                throw new PersonnelleException("Ce rendezvous n'a pas de medecin associe ");
            }
            Cabinet cabinetMedecin = cabinetRepository
                    .findById(rdv.getMedecin().getCabinet().getId())
                    .orElseThrow(() -> new RessourceNotFoundException("Cabinet introuvable"));
            if (!cabinetSecretaire.getId().equals(cabinetMedecin.getId())) {
                throw new PersonnelleException("Ce rendezvous ne fait pas partie de votre cabinet ");
            }
            return;
        }

        throw new PersonnelleException("Action non autorisee sur ce rendezvous ");
    }

    private Cabinet getCabinet(User adminUser, UUID cabinetId) {
        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Cabinet introuvable avec l'id : " + cabinetId
                ));
        if (cabinet.getAdmin() == null || !cabinet.getAdmin().getId().equals(adminUser.getId())) {
            throw new PersonnelleException("Ce cabinet ne vous appartient pas ");
        }
        return cabinet;
    }

    private List<RendezvousResponse> mapToListe(List<Rendezvous> list) {
        return list.stream().map(this::mapToResponse).toList();
    }

    // =====================================================================
    // Méthodes privées
    // =====================================================================

    private Medecin getMedecin(UUID medecinId) {
        return medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin introuvable avec l'id : " + medecinId
                ));
    }

    private void verifierCreneauDisponible(Medecin medecin, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        if (heureFin == null || !heureFin.isAfter(heureDebut)) {
            throw new PersonnelleException("L'heure de fin doit etre apres l'heure de debut ");
        }

        Week_Day jour = convertirEnJour(date);

        List<Disponibilite_Medcin> plages = disponibiliteRepository
                .findByMedecin_IdAndJoursemaine(medecin.getId(), jour);

        boolean plageValide = plages.stream().anyMatch(plage ->
                Boolean.TRUE.equals(plage.getActif())
                        && !heureDebut.isBefore(plage.getHeur_debut())
                        && !heureFin.isAfter(plage.getHeur_fin())
                        && !estDansPause(heureDebut, heureFin, plage));

        if (!plageValide) {
            throw new PersonnelleException(
                    "Le medecin n'est pas disponible le " + jour + " a cette plage horaire "
            );
        }

        if (estCreneauOccupe(medecin, date, heureDebut, heureFin)) {
            throw new RendezvousDejaReserveException(
                    "Ce creneau est deja reserve pour ce medecin "
            );
        }
    }

    private boolean estCreneauOccupe(Medecin medecin, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        boolean indisponible = indesponibilitrepository.findByMedecin_Id(medecin.getId()).stream()
                .anyMatch(ind -> recouvre(ind, date, heureDebut, heureFin));

        if (indisponible) {
            return true;
        }

        LocalTime debut = heureDebut != null ? heureDebut : LocalTime.MIN;
        LocalTime fin = heureFin != null ? heureFin : LocalTime.MIN;

        return rendezvousrepository.findAllByDateRendezvous(date).stream()
                .filter(rdv -> rdv.getMedecin() != null
                        && medecin.getId().equals(rdv.getMedecin().getId()))
                .filter(rdv -> rdv.getStatus() != Status_RendezVous.ANNULE)
                .anyMatch(rdv ->
                        (rdv.getHeureDebut() != null && rdv.getHeureFin() != null)
                                && rdv.getHeureDebut().isBefore(fin)
                                && rdv.getHeureFin().isAfter(debut));
    }

    private boolean recouvre(Indisponibilite ind, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        if (ind.getDate_debut() == null || ind.getDate_fin() == null) {
            return false;
        }

        LocalDateTime debutPause = ind.getDate_debut();
        LocalDateTime finPause = ind.getDate_fin();
        LocalDateTime debutDemande = LocalDateTime.of(date, heureDebut != null ? heureDebut : LocalTime.MIN);
        LocalDateTime finDemande = LocalDateTime.of(date, heureFin != null ? heureFin : LocalTime.MAX);

        return debutDemande.isBefore(finPause) && finDemande.isAfter(debutPause);
    }

    private boolean estDansPause(LocalTime debut, LocalTime fin, Disponibilite_Medcin plage) {
        if (plage.getPause_debut() == null || plage.getPause_fin() == null) {
            return false;
        }
        return debut.isBefore(plage.getPause_fin()) && fin.isAfter(plage.getPause_debut());
    }

    private Week_Day convertirEnJour(LocalDate date) {
        DayOfWeek jour = date.getDayOfWeek();
        return switch (jour) {
            case MONDAY -> Week_Day.LUNDI;
            case TUESDAY -> Week_Day.MARDI;
            case WEDNESDAY -> Week_Day.MERCREDI;
            case THURSDAY -> Week_Day.JEUDI;
            case FRIDAY -> Week_Day.VENDREDI;
            case SATURDAY -> Week_Day.SAMEDI;
            case SUNDAY -> Week_Day.DIMANCHE;
        };
    }

    private RendezvousResponse mapToResponse(Rendezvous rdv) {
        return new RendezvousResponse(
                rdv.getId(),
                rdv.getPatient() != null ? rdv.getPatient().getId() : null,
                rdv.getPatient() != null
                        ? rdv.getPatient().getUser() != null
                        ? rdv.getPatient().getUser().getName()
                        : null
                        : null,
                rdv.getMedecin() != null ? rdv.getMedecin().getId() : null,
                rdv.getMedecin() != null ? rdv.getMedecin().getNom() : null,
                rdv.getCreePar() != null ? rdv.getCreePar().getId() : null,
                rdv.getDateRendezvous(),
                rdv.getHeureDebut(),
                rdv.getHeureFin(),
                rdv.getStatus(),
                rdv.getMotif()
        );
    }
}
