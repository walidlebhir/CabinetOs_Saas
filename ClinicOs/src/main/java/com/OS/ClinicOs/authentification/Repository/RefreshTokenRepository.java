package com.OS.ClinicOs.authentification.Repository;

import com.OS.ClinicOs.authentification.Entity.Refresh_Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<Refresh_Token, UUID> {
}
