package com.OS.ClinicOs.Security;

import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.patient.Repository.PatientRepository;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentPatientProvider {

    private final UserRepository userRepository;
    private final PatientRepository patientrepository;

    public CurrentPatientProvider(
            UserRepository userRepository,
            PatientRepository patientrepository
    ) {
        this.userRepository = userRepository;
        this.patientrepository = patientrepository;
    }

    public Patient getCurrentPatient() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PersonnelleException("Aucun utilisateur authentifie ");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmailAndDeletedAtIsNull(email);

        if (user == null) {
            throw new RessourceNotFoundException("Utilisateur introuvable : " + email);
        }

        if (!Role.PATIENT.equals(user.getRole())) {
            throw new PersonnelleException("Acces reserve aux patients ");
        }

        Patient patient = patientrepository.findByUser_EmailAndDeletedAtIsNull(user.getEmail())
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Aucun profil patient associe au compte : " + email
                ));

        return patient;
    }
}
