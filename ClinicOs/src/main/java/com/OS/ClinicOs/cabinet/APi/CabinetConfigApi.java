package com.OS.ClinicOs.cabinet.APi;


import com.OS.ClinicOs.cabinet.Dto.CabinetRequestDto;
import com.OS.ClinicOs.cabinet.Dto.CabinetResponse;
import com.OS.ClinicOs.cabinet.Services.CabinetConfigService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/config/cabinet")
public class CabinetConfigApi {

    private  final CabinetConfigService cabinetservice ;

    public CabinetConfigApi(
            CabinetConfigService cabinetservice
    ){
        this.cabinetservice = cabinetservice ;
    }

    @PostMapping("/create")
    public ResponseEntity<String> CreateNewConfigCabinet(
            @Valid @RequestBody CabinetRequestDto cabinetrequest ,
            @AuthenticationPrincipal UserDetails user_conect
            ){
        return  this.cabinetservice.CreateNewCabinet(cabinetrequest , user_conect) ;

   }

   @GetMapping("/show")
    public CabinetResponse ShowCabinet(
            @AuthenticationPrincipal UserDetails user_conect
   ){
        return  this.cabinetservice.getcabinet(user_conect) ;
   }

}
