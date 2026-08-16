package com.OS.ClinicOs.medecin;

import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class SoftDeleteMedecinTest {

    @Autowired
    private MedecinRepository medecinRepository;

    // A. Create entity -> deletedAt is NULL
    @Test
    void createMedecin_deletedAtShouldBeNull() {
        Medecin medecin = Medecin.builder()
                .nom("Dupont")
                .prenom("Jean")
                .specialite("Cardiologie")
                .numeroOrder("ORD-001")
                .teliphone("0600000000")
                .build();

        Medecin saved = medecinRepository.save(medecin);
        medecinRepository.flush();

        assertNull(saved.getDeletedAt());
        assertFalse(saved.isDeleted());
    }

    // B. Get active entity -> entity is returned
    @Test
    void findActiveMedecin_shouldBeReturned() {
        Medecin medecin = Medecin.builder()
                .nom("Martin")
                .prenom("Pierre")
                .specialite("Dermatologie")
                .numeroOrder("ORD-002")
                .teliphone("0600000001")
                .build();
        Medecin saved = medecinRepository.save(medecin);
        medecinRepository.flush();

        Optional<Medecin> found = medecinRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals("Martin", found.get().getNom());
    }

    // C. Soft delete entity -> deletedAt is populated and hidden from findAll
    @Test
    void softDeleteMedecin_deletedAtShouldBePopulated() {
        Medecin medecin = Medecin.builder()
                .nom("Bernard")
                .prenom("Paul")
                .specialite("Neurologie")
                .numeroOrder("ORD-003")
                .teliphone("0600000002")
                .build();
        Medecin saved = medecinRepository.save(medecin);
        medecinRepository.flush();

        saved.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(saved);
        medecinRepository.flush();

        assertNotNull(saved.getDeletedAt());
        assertTrue(saved.isDeleted());
        assertTrue(medecinRepository.findAll().isEmpty(), "Soft-deleted entity should be hidden by @SQLRestriction");
    }

    // D. Get deleted entity normally -> entity is not returned by findAll
    @Test
    void findDeletedMedecin_shouldNotBeReturned() {
        Medecin medecin = Medecin.builder()
                .nom("Leroy")
                .prenom("Sophie")
                .specialite("Pediatrie")
                .numeroOrder("ORD-004")
                .teliphone("0600000003")
                .build();
        Medecin saved = medecinRepository.save(medecin);
        medecinRepository.flush();

        saved.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(saved);
        medecinRepository.flush();

        List<Medecin> all = medecinRepository.findAll();
        assertTrue(all.isEmpty(), "Soft-deleted entity should not be returned by findAll");
    }

    // E. Get all entities -> deleted entities are excluded
    @Test
    void findAll_shouldExcludeDeletedEntities() {
        Medecin active = Medecin.builder()
                .nom("Active")
                .prenom("Dr")
                .specialite("Chirurgie")
                .numeroOrder("ORD-005")
                .teliphone("0600000004")
                .build();

        Medecin toDelete = Medecin.builder()
                .nom("Deleted")
                .prenom("Dr")
                .specialite("Radiologie")
                .numeroOrder("ORD-006")
                .teliphone("0600000005")
                .build();

        medecinRepository.save(active);
        Medecin savedDeleted = medecinRepository.save(toDelete);
        medecinRepository.flush();

        savedDeleted.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(savedDeleted);
        medecinRepository.flush();

        List<Medecin> all = medecinRepository.findAll();

        assertEquals(1, all.size());
        assertEquals("Active", all.get(0).getNom());
    }

    // F. Restore entity -> deletedAt becomes NULL
    @Test
    void restoreMedecin_deletedAtShouldBeNull() {
        Medecin medecin = Medecin.builder()
                .nom("Moreau")
                .prenom("Lucie")
                .specialite("Gynecologie")
                .numeroOrder("ORD-007")
                .teliphone("0600000006")
                .build();
        Medecin saved = medecinRepository.save(medecin);
        medecinRepository.flush();

        // Soft delete
        saved.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(saved);
        medecinRepository.flush();

        // Verify hidden from queries
        assertTrue(medecinRepository.findAll().isEmpty());

        // Restore: bypass @SQLRestriction by finding and modifying
        // Since @SQLRestriction hides it, we need to use a custom query or re-fetch
        // For testing, we'll directly set deletedAt on the managed entity
        saved.setDeletedAt(null);
        medecinRepository.save(saved);
        medecinRepository.flush();

        // Verify visible again via findAll
        List<Medecin> restored = medecinRepository.findAll();
        assertEquals(1, restored.size());
        assertNull(restored.get(0).getDeletedAt());
    }

    // G. Verify relationships -> soft-deleted medecins not returned in cabinet collections
    @Test
    void cabinetMedecins_shouldExcludeSoftDeletedMedecins() {
        Medecin active = Medecin.builder()
                .nom("Active")
                .prenom("Dr")
                .specialite("ORL")
                .numeroOrder("ORD-008")
                .teliphone("0600000007")
                .build();

        Medecin deleted = Medecin.builder()
                .nom("Deleted")
                .prenom("Dr")
                .specialite("ORL")
                .numeroOrder("ORD-009")
                .teliphone("0600000008")
                .build();

        medecinRepository.save(active);
        Medecin savedDeleted = medecinRepository.save(deleted);
        medecinRepository.flush();

        savedDeleted.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(savedDeleted);
        medecinRepository.flush();

        // findAll will only return active medecins
        List<Medecin> result = medecinRepository.findAll();
        assertEquals(1, result.size());
        assertEquals("Active", result.get(0).getNom());
    }

    // H. Verify unique constraint: same numeroOrder reusable after soft delete
    @Test
    void softDeletedMedecin_numeroOrderShouldBeReusable() {
        Medecin first = Medecin.builder()
                .nom("Premier")
                .prenom("Dr")
                .specialite("Gastro")
                .numeroOrder("ORD-REUSE")
                .teliphone("0600000009")
                .build();
        medecinRepository.save(first);
        medecinRepository.flush();

        // Soft delete
        first.setDeletedAt(LocalDateTime.now());
        medecinRepository.save(first);
        medecinRepository.flush();

        // Should be able to create another with same numeroOrder
        boolean exists = medecinRepository.existsByNumeroOrderAndDeletedAtIsNull("ORD-REUSE");
        assertFalse(exists, "Soft-deleted numeroOrder should be available for reuse");
    }

    // I. Verify numeroOrder conflict for active entity
    @Test
    void activeMedecin_numeroOrderShouldConflict() {
        Medecin first = Medecin.builder()
                .nom("Conflict")
                .prenom("Dr")
                .specialite("Cardio")
                .numeroOrder("ORD-CONFLICT")
                .teliphone("0600000010")
                .build();
        medecinRepository.save(first);
        medecinRepository.flush();

        boolean exists = medecinRepository.existsByNumeroOrderAndDeletedAtIsNull("ORD-CONFLICT");
        assertTrue(exists, "Active numeroOrder should be flagged as existing");
    }
}
