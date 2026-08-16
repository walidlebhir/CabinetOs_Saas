package com.OS.ClinicOs.notification.Entity;

import com.OS.ClinicOs.notification.Entity.Enum.StatusNotification;
import com.OS.ClinicOs.notification.Entity.Enum.TypeCanal;
import com.OS.ClinicOs.notification.Entity.Enum.TypeNotification;
import com.OS.ClinicOs.shared.entity.SoftDeletableEntity;
import com.OS.ClinicOs.user.Entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@SQLRestriction("deleted_at IS NULL")
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Notification extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    private String titre;
    private String message;
    private Boolean lu;
    private LocalDateTime date_envoi;
    private LocalDateTime date_lecture;

    @Enumerated(EnumType.STRING)
    private TypeCanal canal;

    @Enumerated(EnumType.STRING)
    private StatusNotification status;
}
