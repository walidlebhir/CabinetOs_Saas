package com.OS.ClinicOs.planning.services;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.planning.dto.IndisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.DisponibiliteResponse;
import com.OS.ClinicOs.planning.dto.PlanningRequest;
import com.OS.ClinicOs.planning.dto.PlanningResponse;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class planningservice {

    private final disponibiliteservice disponibiliteservice ;
    private final indisponibiliteservice indisponibiliteservice ;


    public planningservice(
            disponibiliteservice disponibiliteservice ,
            indisponibiliteservice indisponibiliteservice
    ){
        this.disponibiliteservice = disponibiliteservice ;
        this.indisponibiliteservice = indisponibiliteservice ;
    }


    @Transactional
    @Audit(operation = Action.CREATE , description = "Creation d'un planning complet (disponibilites + indisponibilites) par le medecin connecte")
    public PlanningResponse createPlanning(Medecin medecin , PlanningRequest request){

        boolean aucuneDonnee =
                (request.disponibilites() == null || request.disponibilites().isEmpty())
                        && (request.indisponibilites() == null || request.indisponibilites().isEmpty()) ;

        if (aucuneDonnee){
            throw new PersonnelleException(
                    "Le planning doit contenir au moins une disponibilite ou une indisponibilite "
            ) ;
        }

        List<DisponibiliteResponse> disponibilites =
                this.disponibiliteservice.createDisponibilites(medecin , request.disponibilites()) ;

        List<IndisponibiliteResponse> indisponibilites =
                this.indisponibiliteservice.createIndisponibilites(medecin , request.indisponibilites()) ;

        return new PlanningResponse(disponibilites , indisponibilites) ;
    }
}
