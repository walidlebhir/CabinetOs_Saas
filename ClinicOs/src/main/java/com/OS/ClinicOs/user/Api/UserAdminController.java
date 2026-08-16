package com.OS.ClinicOs.user.Api;

import com.OS.ClinicOs.user.Services.AcountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/Admin/api/user")
public class UserAdminController {

    private final AcountService acountService;

    public UserAdminController(AcountService acountService) {
        this.acountService = acountService;
    }

    @PatchMapping("/deactivate/{id}")
    public ResponseEntity<String> DeactivateAccount(@PathVariable UUID id) {
        return this.acountService.deactivateAccount(id);
    }

    @PatchMapping("/activate/{id}")
    public ResponseEntity<String> ActivateAccount(@PathVariable UUID id) {
        return this.acountService.activateAccount(id);
    }
}
