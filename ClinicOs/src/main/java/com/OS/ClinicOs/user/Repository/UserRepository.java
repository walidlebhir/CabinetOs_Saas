package com.OS.ClinicOs.user.Repository;

import com.OS.ClinicOs.user.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User , UUID> {

    User findByEmail(String email) ;

    User findByEmailAndDeletedAtIsNull(String email) ;

    User findByEmailAndDeletedAtIsNullAndIsActiveTrue(String email) ;
}
