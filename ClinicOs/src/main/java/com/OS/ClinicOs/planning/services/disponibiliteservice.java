package com.OS.ClinicOs.planning.services;


import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.planning.Entity.Disponibilite_Medcin;
import com.OS.ClinicOs.planning.Entity.Enum.Week_Day;
import com.OS.ClinicOs.planning.Repository.DisponibiliteRepository;
import com.OS.ClinicOs.planning.dto.DisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.DisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateDisponibiliteRequest;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;


@Service
public class disponibiliteservice {

    private final DisponibiliteRepository disponibiliterepository;
    private final MedecinRepository medecinrepository ;


    public disponibiliteservice(
            DisponibiliteRepository disponibiliteRepository ,
            MedecinRepository medecinrepository
    ){
        this.medecinrepository = medecinrepository ;
        this.disponibiliterepository = disponibiliteRepository ;
    }


    @Transactional
    @Audit(operation = Action.CREATE , description = "Creation d'une disponibilite par un medecin")
    public DisponibiliteResponse createDisponibilite(DisponibiliteRequest request) {

        Medecin medecin = getMedecin(request.medecinId()) ;

        validerHoraires(
                request.heurDebut() ,
                request.heurFin() ,
                request.pauseDebut() ,
                request.pauseFin()
        );

        verifierChevauchement(
                medecin.getId() ,
                request.joursemaine() ,
                request.heurDebut() ,
                request.heurFin() ,
                null
        );

        Disponibilite_Medcin disponibilite = Disponibilite_Medcin.builder()
                .medecin(medecin)
                .Joursemaine(request.joursemaine())
                .heur_debut(request.heurDebut())
                .heur_fin(request.heurFin())
                .dure_creneau(request.dureCreneau())
                .pause_debut(request.pauseDebut())
                .pause_fin(request.pauseFin())
                .actif(request.actif() != null ? request.actif() : true)
                .build();

        return mapToResponse(disponibiliterepository.save(disponibilite)) ;
    }

    @Transactional
    @Audit(operation = Action.UPDATE , description = "Modification d'une disponibilite par un medecin")
    public ResponseEntity<String> updateDisponibilite(UpdateDisponibiliteRequest request) {

        Disponibilite_Medcin disponibilite = disponibiliterepository.findById(request.id())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Disponibilite not found with id : " + request.id()
                ));

        if (!disponibilite.getMedecin().getId().equals(request.medecinId())){
            throw new PersonnelleException(
                    "Cette disponibilite n'appartient pas au medecin : " + request.medecinId()
            );
        }

        Week_Day jour = request.joursemaine() != null ? request.joursemaine() : disponibilite.getJoursemaine();
        LocalTime heurDebut = request.heurDebut() != null ? request.heurDebut() : disponibilite.getHeur_debut();
        LocalTime heurFin = request.heurFin() != null ? request.heurFin() : disponibilite.getHeur_fin();
        LocalTime pauseDebut = request.pauseDebut() != null ? request.pauseDebut() : disponibilite.getPause_debut();
        LocalTime pauseFin = request.pauseFin() != null ? request.pauseFin() : disponibilite.getPause_fin();

        validerHoraires(heurDebut , heurFin , pauseDebut , pauseFin);

        if (request.joursemaine() != null || request.heurDebut() != null || request.heurFin() != null){
            verifierChevauchement(request.medecinId() , jour , heurDebut , heurFin , disponibilite.getId());
        }

        if (request.joursemaine() != null) disponibilite.setJoursemaine(request.joursemaine());
        if (request.heurDebut() != null) disponibilite.setHeur_debut(request.heurDebut());
        if (request.heurFin() != null) disponibilite.setHeur_fin(request.heurFin());
        if (request.dureCreneau() != null) disponibilite.setDure_creneau(request.dureCreneau());
        if (request.pauseDebut() != null) disponibilite.setPause_debut(request.pauseDebut());
        if (request.pauseFin() != null) disponibilite.setPause_fin(request.pauseFin());
        if (request.actif() != null) disponibilite.setActif(request.actif());

        disponibiliterepository.save(disponibilite) ;

        return ResponseEntity.status(HttpStatus.OK).body("Disponibilite updated with succes ") ;
    }

    @Transactional
    @Audit(operation = Action.DELETE , description = "Suppression logique d'une disponibilite")
    public ResponseEntity<String> deleteDisponibilite(Long id) {

        Disponibilite_Medcin disponibilite = disponibiliterepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Disponibilite not found with id : " + id
                ));

        disponibilite.setDeletedAt(java.time.LocalDateTime.now()) ;
        disponibiliterepository.save(disponibilite) ;

        return ResponseEntity.status(HttpStatus.OK).body("Disponibilite soft-deleted with succes ") ;
    }

    @Audit(operation = Action.READ , description = "Consultation des disponibilites d'un medecin")
    public List<DisponibiliteResponse> getDisponibilitesByMedecin(UUID medecinId) {

        getMedecin(medecinId) ;

        return disponibiliterepository.findByMedecin_Id(medecinId)
                .stream()
                .map(this::mapToResponse)
                .toList() ;
    }

    @Audit(operation = Action.READ , description = "Consultation d'une disponibilite par son id")
    public DisponibiliteResponse getDisponibiliteById(Long id) {

        Disponibilite_Medcin disponibilite = disponibiliterepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Disponibilite not found with id : " + id
                ));

        return mapToResponse(disponibilite) ;
    }


    private Medecin getMedecin(UUID medecinId) {
        return medecinrepository.findById(medecinId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin not found with id : " + medecinId
                ));
    }

    private void validerHoraires(
            LocalTime heurDebut ,
            LocalTime heurFin ,
            LocalTime pauseDebut ,
            LocalTime pauseFin
    ) {
        if (!heurFin.isAfter(heurDebut)){
            throw new PersonnelleException("L'heure de fin doit etre apres l'heure de debut ") ;
        }

        if ((pauseDebut == null) != (pauseFin == null)){
            throw new PersonnelleException("La pause doit avoir une heure de debut et une heure de fin ") ;
        }

        if (pauseDebut != null && pauseFin != null){
            if (!pauseFin.isAfter(pauseDebut)){
                throw new PersonnelleException("La fin de la pause doit etre apres le debut de la pause ") ;
            }
            if (pauseDebut.isBefore(heurDebut) || pauseFin.isAfter(heurFin)){
                throw new PersonnelleException("La pause doit etre comprise dans les horaires de travail ") ;
            }
        }
    }

    private void verifierChevauchement(
            UUID medecinId ,
            Week_Day jour ,
            LocalTime heurDebut ,
            LocalTime heurFin ,
            Long idExclu
    ) {
        boolean chevauche = disponibiliterepository.findByMedecin_IdAndJoursemaine(medecinId , jour)
                .stream()
                .filter(d -> idExclu == null || !d.getId().equals(idExclu))
                .anyMatch(d -> d.getHeur_debut().isBefore(heurFin) && d.getHeur_fin().isAfter(heurDebut));

        if (chevauche){
            throw new PersonnelleException(
                    "Une disponibilite existe deja pour ce medecin le " + jour + " sur cette plage horaire "
            );
        }
    }

    private DisponibiliteResponse mapToResponse(Disponibilite_Medcin disponibilite) {
        return new DisponibiliteResponse(
                disponibilite.getId() ,
                disponibilite.getMedecin().getId() ,
                disponibilite.getMedecin().getNom() + " " + disponibilite.getMedecin().getPrenom() ,
                disponibilite.getJoursemaine() ,
                disponibilite.getHeur_debut() ,
                disponibilite.getHeur_fin() ,
                disponibilite.getDure_creneau() ,
                disponibilite.getPause_debut() ,
                disponibilite.getPause_fin() ,
                disponibilite.getActif() ,
                disponibilite.getCreatedAt()
        );
    }
}
