package com.OS.ClinicOs.planning.services;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.planning.Entity.Indisponibilite;
import com.OS.ClinicOs.planning.Repository.Indesponibilitrepository;
import com.OS.ClinicOs.planning.dto.IndisponibiliteRequest;
import com.OS.ClinicOs.planning.dto.IndisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.UpdateIndisponibiliteRequest;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class indisponibiliteservice {

    private final Indesponibilitrepository indesponibilitrepository ;
    private final MedecinRepository medecinrepository ;


    public indisponibiliteservice(
            Indesponibilitrepository indesponibilitrepository ,
            MedecinRepository medecinrepository
    ){
        this.indesponibilitrepository = indesponibilitrepository ;
        this.medecinrepository = medecinrepository ;
    }


    @Transactional
    @Audit(operation = Action.CREATE , description = "Creation d'une indisponibilite par un medecin")
    public IndisponibiliteResponse createIndisponibilite(Medecin medecin , IndisponibiliteRequest request) {

        validerDates(request.dateDebut() , request.dateFin());

        verifierChevauchement(medecin.getId() , request.dateDebut() , request.dateFin() , null);

        Indisponibilite indisponibilite = Indisponibilite.builder()
                .medecin(medecin)
                .date_debut(request.dateDebut())
                .date_fin(request.dateFin())
                .motif(request.motif())
                .type(request.type())
                .build();

        return mapToResponse(indesponibilitrepository.save(indisponibilite)) ;
    }

    @Audit(operation = Action.CREATE , description = "Creation en lot des indisponibilites du planning")
    public List<IndisponibiliteResponse> createIndisponibilites(Medecin medecin , List<IndisponibiliteRequest> requests) {

        if (requests == null || requests.isEmpty()){
            return List.of() ;
        }

        return requests.stream()
                .map(request -> this.createIndisponibilite(medecin , request))
                .toList() ;
    }

    @Transactional
    @Audit(operation = Action.UPDATE , description = "Modification d'une indisponibilite par un medecin")
    public ResponseEntity<String> updateIndisponibilite(Medecin medecin , UpdateIndisponibiliteRequest request) {

        Indisponibilite indisponibilite = indesponibilitrepository.findById(request.id())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Indisponibilite not found with id : " + request.id()
                ));

        if (!indisponibilite.getMedecin().getId().equals(medecin.getId())){
            throw new PersonnelleException(
                    "Cette indisponibilite n'appartient pas au medecin connecte "
            );
        }

        LocalDateTime dateDebut = request.dateDebut() != null ? request.dateDebut() : indisponibilite.getDate_debut();
        LocalDateTime dateFin = request.dateFin() != null ? request.dateFin() : indisponibilite.getDate_fin();

        validerDates(dateDebut , dateFin);

        if (request.dateDebut() != null || request.dateFin() != null){
            verifierChevauchement(medecin.getId() , dateDebut , dateFin , indisponibilite.getId());
        }

        if (request.dateDebut() != null) indisponibilite.setDate_debut(request.dateDebut());
        if (request.dateFin() != null) indisponibilite.setDate_fin(request.dateFin());
        if (request.motif() != null) indisponibilite.setMotif(request.motif());
        if (request.type() != null) indisponibilite.setType(request.type());

        indesponibilitrepository.save(indisponibilite) ;

        return ResponseEntity.status(HttpStatus.OK).body("Indisponibilite updated with succes ") ;
    }

    @Transactional
    @Audit(operation = Action.DELETE , description = "Suppression logique d'une indisponibilite par le medecin connecte")
    public ResponseEntity<String> deleteIndisponibilite(Medecin medecin , Long id) {

        Indisponibilite indisponibilite = indesponibilitrepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Indisponibilite not found with id : " + id
                ));

        if (!indisponibilite.getMedecin().getId().equals(medecin.getId())){
            throw new PersonnelleException(
                    "Cette indisponibilite n'appartient pas au medecin connecte "
            );
        }

        indisponibilite.setDeletedAt(LocalDateTime.now()) ;
        indesponibilitrepository.save(indisponibilite) ;

        return ResponseEntity.status(HttpStatus.OK).body("Indisponibilite soft-deleted with succes ") ;
    }

    @Audit(operation = Action.READ , description = "Consultation des indisponibilites du medecin connecte")
    public List<IndisponibiliteResponse> getIndisponibilitesDuMedecin(Medecin medecin) {
        return indesponibilitrepository.findByMedecin_Id(medecin.getId())
                .stream()
                .map(this::mapToResponse)
                .toList() ;
    }

    @Audit(operation = Action.READ , description = "Consultation des indisponibilites d'un medecin")
    public List<IndisponibiliteResponse> getIndisponibilitesByMedecin(UUID medecinId) {

        getMedecin(medecinId) ;

        return indesponibilitrepository.findByMedecin_Id(medecinId)
                .stream()
                .map(this::mapToResponse)
                .toList() ;
    }

    @Audit(operation = Action.READ , description = "Consultation d'une indisponibilite par son id")
    public IndisponibiliteResponse getIndisponibiliteById(Long id) {

        Indisponibilite indisponibilite = indesponibilitrepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Indisponibilite not found with id : " + id
                ));

        return mapToResponse(indisponibilite) ;
    }


    private Medecin getMedecin(UUID medecinId) {
        return medecinrepository.findById(medecinId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Medecin not found with id : " + medecinId
                ));
    }

    private void validerDates(LocalDateTime dateDebut , LocalDateTime dateFin) {
        if (!dateFin.isAfter(dateDebut)){
            throw new PersonnelleException("La date de fin doit etre apres la date de debut ") ;
        }
        if (dateDebut.isBefore(LocalDateTime.now())){
            throw new PersonnelleException("La date de debut ne peut pas etre dans le passe ") ;
        }
    }

    private void verifierChevauchement(
            UUID medecinId ,
            LocalDateTime dateDebut ,
            LocalDateTime dateFin ,
            Long idExclu
    ) {
        boolean chevauche = indesponibilitrepository.findByMedecin_Id(medecinId)
                .stream()
                .filter(i -> idExclu == null || !i.getId().equals(idExclu))
                .anyMatch(i -> i.getDate_debut().isBefore(dateFin) && i.getDate_fin().isAfter(dateDebut));

        if (chevauche){
            throw new PersonnelleException(
                    "Une indisponibilite existe deja pour ce medecin sur cette periode "
            );
        }
    }

    private IndisponibiliteResponse mapToResponse(Indisponibilite indisponibilite) {
        return new IndisponibiliteResponse(
                indisponibilite.getId() ,
                indisponibilite.getMedecin().getId() ,
                indisponibilite.getMedecin().getNom() + " " + indisponibilite.getMedecin().getPrenom() ,
                indisponibilite.getDate_debut() ,
                indisponibilite.getDate_fin() ,
                indisponibilite.getMotif() ,
                indisponibilite.getType() ,
                indisponibilite.getCreatedAt()
        );
    }
}
