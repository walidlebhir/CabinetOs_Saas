package com.OS.ClinicOs.authentification.Services;


import com.OS.ClinicOs.Security.Jwt.JwtService;
import com.OS.ClinicOs.authentification.Dto.LoginRequest;
import com.OS.ClinicOs.authentification.Dto.LoginResponse;
import com.OS.ClinicOs.authentification.Dto.RegisterRequest;
import com.OS.ClinicOs.authentification.Entity.Refresh_Token;
import com.OS.ClinicOs.authentification.Repository.RefreshTokenRepository;
import com.OS.ClinicOs.patient.Entity.Patient;
import com.OS.ClinicOs.patient.Repository.PatientRepository;
import com.OS.ClinicOs.shared.exception.exception_per.AccountDesactiveException;
import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service

public class AuthentificationService {

    private final UserRepository  userrepository ;
    private final JwtService jwtservice ;
    private final PasswordEncoder paswordencoder ;
    private final AuthenticationManager authentificationmanager ;
    private final PatientRepository patientrepository ;
    private  final RefreshTokenRepository refreshtokenrepository ;


    public AuthentificationService(
            UserRepository userrepository ,
            JwtService jwtservice,
            PasswordEncoder passwordencoder ,
            AuthenticationManager authentificationmanager  ,
            PatientRepository patientrepo ,
            RefreshTokenRepository refreshtokenrepository
    ){
        this.jwtservice = jwtservice ;
        this.userrepository = userrepository ;
        this.authentificationmanager = authentificationmanager ;
        this.paswordencoder = passwordencoder ;
        this.patientrepository = patientrepo ;
        this.refreshtokenrepository = refreshtokenrepository ;
    }

    public String register(RegisterRequest registerdata) {

        try{
            // detect if Acount existe
            User UserAcount = this.userrepository.findByEmailAndDeletedAtIsNull(registerdata.email());
            if(UserAcount != null){
                // acount exsite
                throw  new AccountExisteException("this compt deja existe ") ;
            }

            // create new User and new Patient
            User newuser = User.builder()
                    .name(registerdata.name())
                    .email(registerdata.email())
                    .password(this.paswordencoder.encode(registerdata.password()))
                    .role(Role.PATIENT)
                    .build();
            Patient newPatient = Patient.builder()
                    .user(newuser)
                    .build();
            this.userrepository.save(newuser) ;
            this.patientrepository.save(newPatient) ;

            return  this.jwtservice.generateJwtToken(newuser);

        }catch (DatabaseConnexionException e){

            throw new DatabaseConnexionException("problemme dans data abse "+e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest logindata , String ip_adress  ) {
        Authentication authentication = this.authentificationmanager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        logindata.email() ,
                        logindata.password()
                )
        );

        User user = this.userrepository.findByEmailAndDeletedAtIsNull(logindata.email()) ;
        if(user == null){
            throw  new RessourceNotFoundException("user n'existe pas ") ;

        }

        if(!Boolean.TRUE.equals(user.getIsActive())){
            throw new AccountDesactiveException("Compte desactive. Veuillez contacter l'administrateur.") ;
        }

        // generer acces token
        String token_acces = this.jwtservice.generateJwtToken(user) ;

        // generrate Refresh token :

        String Refreshtoken = UUID.randomUUID().toString() ;
        // hash
        String hash_RefreshToken = this.paswordencoder.encode(Refreshtoken) ;

        Refresh_Token refreshToken = Refresh_Token.builder()
                .user(user)
                .token_hash(hash_RefreshToken)
                .date_expiration(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .devis_info(null)
                .ip_address(ip_adress)
                .build();

        this.refreshtokenrepository.save(refreshToken) ;
        System.out.println("ip adress : "+ip_adress);

        return new  LoginResponse(
                token_acces ,
                Refreshtoken
        );

    }

}
