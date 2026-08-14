package com.OS.ClinicOs.authentification.Services;


import com.OS.ClinicOs.Security.Jwt.JwtService;
import com.OS.ClinicOs.authentification.Dto.AdminRegisterRequest;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminRegister {

    private final UserRepository  userrepository ;
    private final JwtService jwtservice ;
    private final PasswordEncoder paswordencoder ;
    private  final MedecinRepository medecinrepository ;

    public  AdminRegister(
            UserRepository userrepository ,
            JwtService jwtservice ,
            PasswordEncoder passwordencoder ,
            MedecinRepository medecinrepository
    ){
        this.jwtservice = jwtservice ;
        this.medecinrepository = medecinrepository ;
        this.paswordencoder = passwordencoder ;
        this.userrepository = userrepository ;
    }


    @Transactional
    public String RegisterAdmin(AdminRegisterRequest registerdata ){
        try{

            // tester acount :
            User user = this.userrepository.findByEmail(registerdata.email()) ;
            if(user != null){
                throw new AccountExisteException("user existe ") ;
            }

            // craete new user
            User newuser = User.builder()
                    .name(registerdata.name())
                    .email(registerdata.email())
                    .role(Role.ADMIN)
                    .password(this.paswordencoder.encode(registerdata.password()))
                    .build();

            // craete new medcin
            Medecin newMedcin = Medecin.builder()
                    .nom(registerdata.nom())
                    .prenom(registerdata.prenom())
                    .biographie(registerdata.Biographie())
                    .specialite(registerdata.specialite())
                    .numeroOrder(registerdata.numeroOrder())
                    .teliphone(registerdata.teliphone())
                    .anneesExperience(registerdata.annes_experience())
                    .user(newuser)
                    .build();

            newuser.setMedecin(newMedcin);
            this.medecinrepository.save(newMedcin) ;
            this.userrepository.save(newuser) ;

            return  this.jwtservice.generateJwtToken(newuser) ;
        }catch (DatabaseConnexionException databaseException ){
            throw  new DatabaseConnexionException(databaseException.getMessage());
        }
    }

}
