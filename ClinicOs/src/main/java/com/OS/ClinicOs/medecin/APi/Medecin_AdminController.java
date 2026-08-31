package com.OS.ClinicOs.medecin.APi;

import com.OS.ClinicOs.medecin.Dto.MedecinAccountRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountResponse;
import com.OS.ClinicOs.medecin.Dto.MedecinImportResult;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/Admin/api/medecin")
public class Medecin_AdminController {

    private final MedecinService medecinService ;

    public Medecin_AdminController(
            MedecinService medecinService
    ){
        this.medecinService = medecinService ;
    }

    @PostMapping("/create")
    public MedecinResponse CreateMedecin(
            @Valid @RequestBody MedecinRequest request
    ){
        return this.medecinService.CreateMedecin(request) ;
    }

    @GetMapping("/{id}")
    public MedecinResponse GetMedecinById(
            @PathVariable UUID id
    ){
        return this.medecinService.GetMedecinById(id) ;
    }

    @PutMapping("/update")
    public ResponseEntity<String> UpdateMedecin(
            @Valid @RequestBody UpdateMedecinRequest request
    ){
        return this.medecinService.UpdateMedecinData(request) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> DeleteMedecin(
            @PathVariable UUID id
    ){
        return this.medecinService.deleteMedecin(id) ;
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<String> RestoreMedecin(
            @PathVariable UUID id
    ){
        return this.medecinService.restoreMedecin(id) ;
    }

    @GetMapping("/cabinet/{cabinetId}")
    public List<MedecinResponse> GetAllMedecinByCabinet(
            @PathVariable UUID cabinetId
    ){
        return this.medecinService.getALlMedecinByCabinet(cabinetId) ;
    }

    @PostMapping("/account/create")
    public MedecinAccountResponse CreateMedecinAccount(
            @Valid @RequestBody MedecinAccountRequest request
    ){
        return this.medecinService.CreateMedecinAccount(request) ;
    }

    @PostMapping("/import")
    public MedecinImportResult ImportMedecins(
            @RequestParam("file") MultipartFile file ,
            @RequestParam("cabinetId") UUID cabinetId
    ){
        return this.medecinService.importMedecins(file , cabinetId) ;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> ExportMedecins(
            @RequestParam("format") String format ,
            @RequestParam("cabinetId") UUID cabinetId
    ){
        byte[] bytes ;
        String contentType ;
        String filename ;

        if ("csv".equalsIgnoreCase(format)){
            bytes = this.medecinService.exportMedecinsCsv(cabinetId) ;
            contentType = "text/csv; charset=UTF-8" ;
            filename = "medecins.csv" ;
        }else if ("xlsx".equalsIgnoreCase(format) || "excel".equalsIgnoreCase(format)){
            bytes = this.medecinService.exportMedecinsExcel(cabinetId) ;
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ;
            filename = "medecins.xlsx" ;
        }else if ("xls".equalsIgnoreCase(format)){
            bytes = this.medecinService.exportMedecinsExcel(cabinetId) ;
            contentType = "application/vnd.ms-excel" ;
            filename = "medecins.xls" ;
        }else {
            throw new PersonnelleException("Format d'export invalide : " + format) ;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION ,
                        ContentDisposition.attachment()
                                .filename(filename , StandardCharsets.UTF_8)
                                .build()
                                .toString())
                .contentType(MediaType.parseMediaType(contentType))
                .body(bytes) ;
    }
}
