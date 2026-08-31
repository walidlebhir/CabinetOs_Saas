package com.OS.ClinicOs.planning.dto;

import java.util.List;

public record PlanningResponse(

        List<DisponibiliteResponse> disponibilites ,

        List<IndisponibiliteResponse> indisponibilites
) {
}
