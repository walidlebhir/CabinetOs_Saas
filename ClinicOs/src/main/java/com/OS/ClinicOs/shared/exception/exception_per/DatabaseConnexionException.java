package com.OS.ClinicOs.shared.exception.exception_per;

public class DatabaseConnexionException extends RuntimeException {

    public DatabaseConnexionException() {
        super();
    }

    public DatabaseConnexionException(String message) {
        super(message);
    }

    public DatabaseConnexionException(String message, Throwable cause) {
        super(message, cause);
    }

    public DatabaseConnexionException(Throwable cause) {
        super(cause);
    }
}
