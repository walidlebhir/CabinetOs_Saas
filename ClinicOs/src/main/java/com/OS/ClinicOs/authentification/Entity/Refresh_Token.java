package com.OS.ClinicOs.authentification.Entity;

import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_token")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Refresh_Token {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String token_hash;
    private LocalDateTime date_expiration;
    private boolean revoked;

    @CreationTimestamp
    private LocalDateTime CreatedAt;

    private String devis_info;
    private String ip_address;
}
