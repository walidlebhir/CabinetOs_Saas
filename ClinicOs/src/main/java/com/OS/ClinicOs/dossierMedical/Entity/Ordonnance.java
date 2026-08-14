package com.OS.ClinicOs.dossierMedical.Entity;

import com.OS.ClinicOs.dossierMedical.Entity.Enum.StatusOrdonnance;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.patient.Entity.Patient;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ordonnance")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Ordonnance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dossier_medical_id")
    private Dossier_medical dossierMedical;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private LocalDateTime date_prescription;
    private String instruction_generale;

    @Enumerated(EnumType.STRING)
    private StatusOrdonnance status;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
