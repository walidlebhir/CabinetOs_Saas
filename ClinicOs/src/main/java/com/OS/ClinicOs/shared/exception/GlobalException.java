package com.OS.ClinicOs.shared.exception;

import com.OS.ClinicOs.shared.exception.exception_per.AccountExisteException;
import com.OS.ClinicOs.shared.exception.exception_per.AutreException;
import com.OS.ClinicOs.shared.exception.exception_per.DatabaseConnexionException;
import com.OS.ClinicOs.shared.exception.exception_per.Dto.ErrorResponse;
import com.OS.ClinicOs.shared.exception.exception_per.PersonnelleException;
import com.OS.ClinicOs.shared.exception.exception_per.RessourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + " : " + error.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Données invalides");
        return buildResponse(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(PersonnelleException.class)
    public ResponseEntity<ErrorResponse> handlePersonnelleException(
            PersonnelleException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(DatabaseConnexionException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseConnexionException(
            DatabaseConnexionException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), request);
    }

    @ExceptionHandler(RessourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRessourceNotFoundException(
            RessourceNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(AccountExisteException.class)
    public ResponseEntity<ErrorResponse> handleAccountExisteException(
            AccountExisteException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(AutreException.class)
    public ResponseEntity<ErrorResponse> handleAutreException(
            AutreException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request);
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        return new ResponseEntity<>(body, status);
    }
}
