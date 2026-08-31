package com.OS.ClinicOs.planning.dto;

import jakarta.validation.Valid;

import java.util.List;

public record PlanningRequest(

        List<@Valid DisponibiliteRequest> disponibilites ,

        List<@Valid IndisponibiliteRequest> indisponibilites
) {
}
