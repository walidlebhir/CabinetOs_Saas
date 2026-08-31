package com.OS.ClinicOs.medecin.Services;


import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;
import com.OS.ClinicOs.audit.annotation.Audit;
import com.OS.ClinicOs.cabinet.Entity.Cabinet;
import com.OS.ClinicOs.cabinet.Repository.CabinetRepository;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinAccountResponse;
import com.OS.ClinicOs.medecin.Dto.MedecinImportResult;
import com.OS.ClinicOs.medecin.Dto.MedecinRequest;
import com.OS.ClinicOs.medecin.Dto.MedecinResponse;
import com.OS.ClinicOs.medecin.Dto.UpdateMedecinRequest;
import com.OS.ClinicOs.medecin.Entity.Medecin;
import com.OS.ClinicOs.medecin.Repository.MedecinRepository;
import com.OS.ClinicOs.medecin.Services.Interface.MedecinService;
import com.OS.ClinicOs.shared.email.EmailService;
import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.AutreException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import com.OS.ClinicOs.shared.utils.PasswordGenerator;
import com.OS.ClinicOs.user.Entity.Enum.Role;
import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class MedcinServiceImp implements MedecinService {

    private final MedecinRepository medcinrepository ;
    private final UserRepository userrepository ;
    private final CabinetRepository cabinetrepository ;
    private final PasswordEncoder passwordEncoder ;
    private final EmailService emailService ;
    private final PasswordGenerator passwordGenerator ;


    public MedcinServiceImp(
            MedecinRepository medcinrepository ,
            UserRepository userrepository  ,
            CabinetRepository cabinetrepository ,
            PasswordEncoder passwordEncoder ,
            EmailService emailService ,
            PasswordGenerator passwordGenerator
    ){
        this.medcinrepository = medcinrepository ;
        this.userrepository = userrepository ;
        this.cabinetrepository = cabinetrepository ;
        this.passwordEncoder = passwordEncoder ;
        this.emailService = emailService ;
        this.passwordGenerator = passwordGenerator ;
    }


    @Override
    @Transactional
    @Audit(operation = Action.CREATE , description = "Creation d'un nouveau medecin")
    public MedecinResponse CreateMedecin(MedecinRequest datamedecin) {
        try{

            Cabinet cabinet = cabinetrepository.findById(datamedecin.cabinetId())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Cabinet not found with id : " + datamedecin.cabinetId()
                    ));

            if (medcinrepository.existsByNumeroOrderAndDeletedAtIsNull(datamedecin.numeroOrder())){
                throw new AccountExisteException(
                        "Un medecin avec ce numero d'ordre existe deja : " + datamedecin.numeroOrder()
                );
            }

            Medecin new_medecin = Medecin.builder()
                    .nom(datamedecin.nom())
                    .prenom(datamedecin.prenom())
                    .specialite(datamedecin.specialite())
                    .teliphone(datamedecin.teliphone())
                    .numeroOrder(datamedecin.numeroOrder())
                    .biographie(datamedecin.biographie())
                    .anneesExperience(datamedecin.anneesExperience())
                    .cabinet(cabinet)
                    .user(null)
                    .build();

            Medecin saved_medecin = medcinrepository.save(new_medecin) ;
            return mapToResponse(saved_medecin) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Audit(operation = Action.READ , description = "Consultation d'un medecin par son id")
    public MedecinResponse GetMedecinById(UUID id) {
        try{
            Medecin medecin = medcinrepository.findById(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));
            return mapToResponse(medecin) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.READ , description = "Consultation du profil du medecin connecte")
    public MedecinResponse GetMonProfil(Medecin medecin) {
        return mapToResponse(medecin) ;
    }

    @Override
    @Transactional
    @Audit(operation = Action.UPDATE , description = "Modification des donnees d'un medecin")
    public ResponseEntity<String> UpdateMedecinData(UpdateMedecinRequest data) {
        try{

            Medecin medecin = medcinrepository.findById(data.id())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + data.id()
                    ));

            if (data.nom() != null) medecin.setNom(data.nom());
            if (data.prenom() != null) medecin.setPrenom(data.prenom());
            if (data.specialite() != null) medecin.setSpecialite(data.specialite());
            if (data.numeroOrder() != null) medecin.setNumeroOrder(data.numeroOrder());
            if (data.teliphone() != null) medecin.setTeliphone(data.teliphone());
            if (data.biographie() != null) medecin.setBiographie(data.biographie());
            if (data.anneesExperience() >= 0) medecin.setAnneesExperience(data.anneesExperience());

            medcinrepository.save(medecin) ;
            return ResponseEntity.status(HttpStatus.OK).body("Medecin updated with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.DELETE , description = "Suppression logique d'un medecin")
    public ResponseEntity<String> deleteMedecin(UUID id) {
        try{

            Medecin medecin = medcinrepository.findById(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));

            medecin.setDeletedAt(LocalDateTime.now()) ;
            medcinrepository.save(medecin) ;

            return ResponseEntity.status(HttpStatus.OK).body("Medecin soft-deleted with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.UPDATE , description = "Restauration d'un medecin supprime")
    public ResponseEntity<String> restoreMedecin(UUID id) {
        try{

            Medecin medecin = medcinrepository.findByIdIncludingDeleted(id)
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + id
                    ));

            if (!medecin.isDeleted()){
                return ResponseEntity.status(HttpStatus.OK).body("Medecin is not deleted ") ;
            }

            medecin.setDeletedAt(null) ;
            medcinrepository.save(medecin) ;

            return ResponseEntity.status(HttpStatus.OK).body("Medecin restored with succes ") ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Audit(operation = Action.READ , description = "Liste des medecins d'un cabinet")
    public List<MedecinResponse> getALlMedecinByCabinet(UUID cabinet_id) {
        try{

            return medcinrepository.findByCabinet_Id(cabinet_id)
                    .stream()
                    .map(this::mapToResponse)
                    .toList() ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    public MedecinAccountResponse CreateMedecinAccount(MedecinAccountRequest data) {
        try{

            Medecin medecin = medcinrepository.findById(data.medecinId())
                    .orElseThrow(() -> new RessourceNotFoundException(
                            "Medecin not found with id : " + data.medecinId()
                    ));

            if (medecin.getUser() != null){
                throw new AccountExisteException("Ce medecin a deja un compte utilisateur ") ;
            }

            if (userrepository.findByEmailAndDeletedAtIsNull(data.email()) != null){
                throw new AccountExisteException("Un compte avec cet email existe deja : " + data.email()) ;
            }

            String generatedPassword = passwordGenerator.generateRandomPassword() ;

            User new_user = User.builder()
                    .name(medecin.getNom() + " " + medecin.getPrenom())
                    .email(data.email())
                    .password(passwordEncoder.encode(generatedPassword))
                    .role(Role.MEDECIN)
                    .build();

            User saved_user = userrepository.save(new_user) ;
            medecin.setUser(saved_user) ;
            medcinrepository.save(medecin) ;

            emailService.sendAccountCreatedEmail(
                    saved_user.getEmail() ,
                    saved_user.getName() ,
                    saved_user.getEmail() ,
                    generatedPassword
            );

            return new MedecinAccountResponse(
                    medecin.getId() ,
                    saved_user.getEmail() ,
                    generatedPassword
            ) ;

        }catch (DatabaseConnexionException e){
            System.out.println("Problemme dans database "+e.getMessage());
            throw new DatabaseConnexionException("data base conection problem ");
        }
    }

    @Override
    @Transactional
    @Audit(operation = Action.CREATE , description = "Import de medecins depuis un fichier CSV ou Excel")
    public MedecinImportResult importMedecins(MultipartFile file , UUID cabinetId ) {
        Cabinet cabinet = cabinetrepository.findById(cabinetId)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Cabinet not found with id : " + cabinetId
                )) ;

        if (file == null || file.isEmpty()){
            throw new PersonnelleException("Le fichier est vide ou absent.") ;
        }

        String filename = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase()
                : "" ;

        List<MedecinImportResult.ErreurLigne> erreurs = new ArrayList<>() ;
        List<Object[]> rowsData = new ArrayList<>() ;

        try{
            if (filename.endsWith(".csv")){
                parseCsv(file , rowsData) ;
            }else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")){
                parseExcel(file , rowsData) ;
            }else {
                throw new PersonnelleException("Format non supporte. Utilisez un fichier .csv , .xlsx ou .xls.") ;
            }
        }catch (PersonnelleException e){
            throw e ;
        }catch (Exception e){
            throw new PersonnelleException("Impossible de lire le fichier : " + e.getMessage()) ;
        }

        int importes = 0 ;
        Set<String> numeroOrderDuFichier = new HashSet<>() ;

        for (Object[] row : rowsData){
            int ligne = (Integer) row[0] ;
            String nom = (String) row[1] ;
            String prenom = (String) row[2] ;
            String specialite = (String) row[3] ;
            String numeroOrder = (String) row[4] ;
            String teliphone = (String) row[5] ;
            String biographie = (String) row[6] ;
            String anneesStr = (String) row[7] ;

            if (nom.isEmpty() || prenom.isEmpty() || specialite.isEmpty() || numeroOrder.isEmpty()){
                erreurs.add(new MedecinImportResult.ErreurLigne(
                        ligne ,
                        "Nom , prenom , specialite et numero d'ordre sont obligatoires."
                )) ;
                continue ;
            }

            int anneesExperience ;
            try{
                anneesExperience = anneesStr == null || anneesStr.isBlank()
                        ? 0
                        : Integer.parseInt(anneesStr.trim()) ;
                if (anneesExperience < 0) throw new NumberFormatException() ;
            }catch (NumberFormatException e){
                erreurs.add(new MedecinImportResult.ErreurLigne(
                        ligne ,
                        "Annee d'experience invalide : '" + (anneesStr == null ? "" : anneesStr) + "'."
                )) ;
                continue ;
            }

            if (!numeroOrderDuFichier.add(numeroOrder)){
                erreurs.add(new MedecinImportResult.ErreurLigne(
                        ligne ,
                        "Numero d'ordre duplique dans le fichier : " + numeroOrder
                )) ;
                continue ;
            }

            if (medcinrepository.existsByNumeroOrderAndDeletedAtIsNull(numeroOrder)){
                erreurs.add(new MedecinImportResult.ErreurLigne(
                        ligne ,
                        "Un medecin avec ce numero d'ordre existe deja : " + numeroOrder
                )) ;
                continue ;
            }

            Medecin medecin = Medecin.builder()
                    .nom(nom)
                    .prenom(prenom)
                    .specialite(specialite)
                    .numeroOrder(numeroOrder)
                    .teliphone(teliphone == null || teliphone.isEmpty() ? null : teliphone)
                    .biographie(biographie == null || biographie.isEmpty() ? null : biographie)
                    .anneesExperience(anneesExperience)
                    .cabinet(cabinet)
                    .user(null)
                    .build() ;

            medcinrepository.save(medecin) ;
            importes++ ;
        }

        return new MedecinImportResult(rowsData.size() , importes , erreurs) ;
    }

    @Override
    @Audit(operation = Action.READ , description = "Export des medecins d'un cabinet en CSV")
    public byte[] exportMedecinsCsv(UUID cabinetId ) {
        try{
            List<Medecin> medecins = medcinrepository.findByCabinet_Id(cabinetId) ;

            ByteArrayOutputStream out = new ByteArrayOutputStream() ;
            out.write(0xEF) ;
            out.write(0xBB) ;
            out.write(0xBF) ;

            try(OutputStreamWriter writer = new OutputStreamWriter(out , StandardCharsets.UTF_8) ;
                CSVPrinter printer = new CSVPrinter(writer , CSVFormat.DEFAULT.builder()
                        .setDelimiter(';')
                        .setHeader("nom" , "prenom" , "specialite" , "numeroOrder" , "teliphone" , "biographie" , "anneesExperience")
                        .build())){

                for (Medecin medecin : medecins){
                    printer.printRecord(
                            medecin.getNom() ,
                            medecin.getPrenom() ,
                            medecin.getSpecialite() ,
                            medecin.getNumeroOrder() ,
                            valeur(medecin.getTeliphone()) ,
                            valeur(medecin.getBiographie()) ,
                            medecin.getAnneesExperience()
                    ) ;
                }
            }

            return out.toByteArray() ;

        }catch (Exception e){
            throw new AutreException("Impossible d'exporter les medecins en CSV : " + e.getMessage()) ;
        }
    }

    @Override
    @Audit(operation = Action.READ , description = "Export des medecins d'un cabinet en Excel")
    public byte[] exportMedecinsExcel(UUID cabinetId ) {
        try{
            List<Medecin> medecins = medcinrepository.findByCabinet_Id(cabinetId) ;

            try(XSSFWorkbook workbook = new XSSFWorkbook() ;
                ByteArrayOutputStream out = new ByteArrayOutputStream()){

                Sheet sheet = workbook.createSheet("Medecins") ;

                Font headerFont = workbook.createFont() ;
                headerFont.setBold(true) ;
                CellStyle headerStyle = workbook.createCellStyle() ;
                headerStyle.setFont(headerFont) ;

                String[] headers = {"nom" , "prenom" , "specialite" , "numeroOrder" , "teliphone" , "biographie" , "anneesExperience"} ;

                Row headerRow = sheet.createRow(0) ;
                for (int i = 0 ; i < headers.length ; i++){
                    Cell cell = headerRow.createCell(i) ;
                    cell.setCellValue(headers[i]) ;
                    cell.setCellStyle(headerStyle) ;
                }

                int rowIdx = 1 ;
                for (Medecin medecin : medecins){
                    Row row = sheet.createRow(rowIdx++) ;
                    row.createCell(0).setCellValue(medecin.getNom()) ;
                    row.createCell(1).setCellValue(medecin.getPrenom()) ;
                    row.createCell(2).setCellValue(medecin.getSpecialite()) ;
                    row.createCell(3).setCellValue(medecin.getNumeroOrder()) ;
                    row.createCell(4).setCellValue(valeur(medecin.getTeliphone())) ;
                    row.createCell(5).setCellValue(valeur(medecin.getBiographie())) ;
                    row.createCell(6).setCellValue(medecin.getAnneesExperience()) ;
                }

                for (int i = 0 ; i < headers.length ; i++){
                    sheet.autoSizeColumn(i) ;
                }

                workbook.write(out) ;
                return out.toByteArray() ;
            }

        }catch (Exception e){
            throw new AutreException("Impossible d'exporter les medecins en Excel : " + e.getMessage()) ;
        }
    }

    private void parseCsv(MultipartFile file , List<Object[]> rowsData ) throws IOException {
        byte[] bytes = file.getBytes() ;
        String content = new String(bytes , StandardCharsets.UTF_8) ;
        char delimiter = detecterDelimiteur(content) ;

        try(Reader reader = new StringReader(content) ;
            CSVParser parser = CSVFormat.DEFAULT.builder()
                    .setDelimiter(delimiter)
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreEmptyLines(true)
                    .setTrim(true)
                    .build()
                    .parse(reader)){

            for (CSVRecord record : parser){
                rowsData.add(new Object[]{
                        (int) record.getRecordNumber() ,
                        valeurCsv(record , "nom") ,
                        valeurCsv(record , "prenom") ,
                        valeurCsv(record , "specialite") ,
                        valeurCsv(record , "numeroOrder") ,
                        valeurCsv(record , "teliphone") ,
                        valeurCsv(record , "biographie") ,
                        valeurCsv(record , "anneesExperience")
                }) ;
            }
        }
    }

    private void parseExcel(MultipartFile file , List<Object[]> rowsData ) throws IOException {
        DataFormatter formatter = new DataFormatter() ;

        try(InputStream in = file.getInputStream() ;
            Workbook workbook = WorkbookFactory.create(in)){

            Sheet sheet = workbook.getSheetAt(0) ;
            if (sheet == null){
                throw new PersonnelleException("Le fichier Excel ne contient aucune feuille.") ;
            }

            boolean firstRow = true ;
            for (Row row : sheet){
                if (firstRow){
                    firstRow = false ;
                    continue ;
                }

                String nom = valeurCellule(row , 0 , formatter) ;
                String prenom = valeurCellule(row , 1 , formatter) ;
                String specialite = valeurCellule(row , 2 , formatter) ;
                String numeroOrder = valeurCellule(row , 3 , formatter) ;
                String teliphone = valeurCellule(row , 4 , formatter) ;
                String biographie = valeurCellule(row , 5 , formatter) ;
                String anneesExperience = valeurCellule(row , 6 , formatter) ;

                if (nom.isEmpty() && prenom.isEmpty() && specialite.isEmpty()
                        && numeroOrder.isEmpty() && teliphone.isEmpty()
                        && biographie.isEmpty() && anneesExperience.isEmpty()){
                    continue ;
                }

                rowsData.add(new Object[]{
                        row.getRowNum() + 1 ,
                        nom ,
                        prenom ,
                        specialite ,
                        numeroOrder ,
                        teliphone ,
                        biographie ,
                        anneesExperience
                }) ;
            }
        }
    }

    private String valeurCsv(CSVRecord record , String colonne ) {
        try{
            return record.isMapped(colonne) ? record.get(colonne) : "" ;
        }catch (Exception e){
            return "" ;
        }
    }

    private String valeurCellule(Row row , int index , DataFormatter formatter ) {
        Cell cell = row.getCell(index) ;
        return cell == null ? "" : formatter.formatCellValue(cell).trim() ;
    }

    private char detecterDelimiteur(String contenu ) {
        int finPremiereLigne = contenu.indexOf('\n') ;
        String premiereLigne = finPremiereLigne >= 0
                ? contenu.substring(0 , finPremiereLigne)
                : contenu ;
        long virgules = premiereLigne.chars().filter(c -> c == ',').count() ;
        long pointVirgules = premiereLigne.chars().filter(c -> c == ';').count() ;
        return pointVirgules > virgules ? ';' : ',' ;
    }

    private String valeur(String value ) {
        return value == null ? "" : value ;
    }

    private MedecinResponse mapToResponse(Medecin medecin) {
        User user = medecin.getUser() ;
        return new MedecinResponse(
                medecin.getId() ,
                medecin.getNom() ,
                medecin.getPrenom() ,
                medecin.getSpecialite() ,
                medecin.getNumeroOrder() ,
                medecin.getTeliphone() ,
                medecin.getBiographie() ,
                medecin.getAnneesExperience() ,
                user != null ? user.getEmail() : null ,
                user != null ,
                user != null ? user.getId() : null ,
                user != null ? user.getIsActive() : null ,
                medecin.getCabinet() != null ? medecin.getCabinet().getId() : null ,
                medecin.getCabinet() != null ? medecin.getCabinet().getNom() : null
        );
    }
}
