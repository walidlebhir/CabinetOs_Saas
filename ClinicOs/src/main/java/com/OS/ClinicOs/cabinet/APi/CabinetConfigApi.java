package com.OS.ClinicOs.cabinet.APi;


import com.OS.ClinicOs.cabinet.Dto.CabinetRequestDto;
import com.OS.ClinicOs.cabinet.Dto.CabinetResponse;
import com.OS.ClinicOs.cabinet.Services.CabinetConfigService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/config/cabinet", "/api/config/cabinet"})
public class CabinetConfigApi {

    private  final CabinetConfigService cabinetservice ;

    public CabinetConfigApi(
            CabinetConfigService cabinetservice
    ){
        this.cabinetservice = cabinetservice ;
    }

    // creer un nouveau cabinet
    @PostMapping("/create")
    public ResponseEntity<String> CreateNewConfigCabinet(
            @Valid @RequestBody CabinetRequestDto cabinetrequest ,
            @AuthenticationPrincipal UserDetails user_conect
            ){
        return  this.cabinetservice.CreateNewCabinet(cabinetrequest , user_conect) ;
   }

   // lister les cabinets de l'admin connecte
   @GetMapping("/list")
   public List<CabinetResponse> ShowMesCabinets(
           @AuthenticationPrincipal UserDetails user_conect
   ){
        return this.cabinetservice.getMesCabinets(user_conect) ;
   }

   // consulter un cabinet par son id
   @GetMapping("/{cabinetId}")
   public CabinetResponse ShowCabinet(
           @PathVariable UUID cabinetId ,
           @AuthenticationPrincipal UserDetails user_conect
   ){
        return this.cabinetservice.getCabinet(cabinetId , user_conect) ;
   }

   // mettre a jour la configuration d'un cabinet
   @PutMapping("/{cabinetId}")
   public ResponseEntity<String> UpdateCabinet(
           @PathVariable UUID cabinetId ,
           @Valid @RequestBody CabinetRequestDto cabinetrequest ,
           @AuthenticationPrincipal UserDetails user_conect
   ){
        return this.cabinetservice.UpdateCabinet(cabinetId , cabinetrequest , user_conect) ;
   }

   // activer un cabinet
   @PatchMapping("/{cabinetId}/activate")
   public ResponseEntity<String> ActiverCabinet(
           @PathVariable UUID cabinetId ,
           @AuthenticationPrincipal UserDetails user_conect
   ){
        return this.cabinetservice.ActiverCabinet(cabinetId , user_conect) ;
   }

   // desactiver un cabinet
   @PatchMapping("/{cabinetId}/deactivate")
   public ResponseEntity<String> DesactiverCabinet(
           @PathVariable UUID cabinetId ,
           @AuthenticationPrincipal UserDetails user_conect
   ){
        return this.cabinetservice.DesactiverCabinet(cabinetId , user_conect) ;
   }

}
