package com.OS.ClinicOs.authentification.api.Controllers;


import com.OS.ClinicOs.authentification.Dto.AdminRegisterRequest;
import com.OS.ClinicOs.authentification.Dto.LoginRequest;
import com.OS.ClinicOs.authentification.Dto.LoginResponse;
import com.OS.ClinicOs.authentification.Dto.RegisterRequest;
import com.OS.ClinicOs.authentification.Services.AdminRegister;
import com.OS.ClinicOs.authentification.Services.AuthentificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authentification")
public class AuthController {

    private  final AuthentificationService authservice ;
    private final AdminRegister adminregisterservice ;

    public AuthController(
            AuthentificationService authservice ,
            AdminRegister adminregisterservice
    ){
        this.authservice = authservice ;
        this.adminregisterservice = adminregisterservice ;
    }

    @PostMapping("/register")
    public  String RegisterMethode(@Valid @RequestBody RegisterRequest registerrequest ){
        return  this.authservice.register(registerrequest) ;
    }

    // login
    @PostMapping("/login")
    public LoginResponse Loginmethode(
            @Valid @RequestBody LoginRequest dataloginRequest ,
            HttpServletRequest request
    ){
        String ip_adress = request.getRemoteAddr();
        return  this.authservice.login(dataloginRequest , ip_adress) ;
    }

    // register Admin :
    @PostMapping("/register/admin")
    public  String RegisterAdmin(@Valid @RequestBody AdminRegisterRequest adminregisterRequest){
        return  this.adminregisterservice.RegisterAdmin(adminregisterRequest) ;
    }

}
