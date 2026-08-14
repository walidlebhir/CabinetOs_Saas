package com.OS.ClinicOs.authentification.Dto;

public record LoginResponse(
        String access_token ,
        String refresh_token
) {
}
