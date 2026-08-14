package com.OS.ClinicOs.renezvous.Repository;

import com.OS.ClinicOs.renezvous.Entity.Rendezvous;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RendezvousRepository extends JpaRepository<Rendezvous , UUID> {

}
