package com.OS.ClinicOs.shared.exception.exception_per;

public class RessourceNotFoundException extends RuntimeException {

    public RessourceNotFoundException() {
        super();
    }

    public RessourceNotFoundException(String message) {
        super(message);
    }

    public RessourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public RessourceNotFoundException(Throwable cause) {
        super(cause);
    }
}
