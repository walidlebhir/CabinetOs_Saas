package com.OS.ClinicOs.notification.Repository;

import com.OS.ClinicOs.notification.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification , Long> {

}
