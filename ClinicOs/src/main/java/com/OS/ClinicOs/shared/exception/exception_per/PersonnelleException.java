package com.OS.ClinicOs.shared.exception.exception_per;

public class PersonnelleException extends RuntimeException {

    public PersonnelleException() {
        super();
    }

    public PersonnelleException(String message) {
        super(message);
    }

    public PersonnelleException(String message, Throwable cause) {
        super(message, cause);
    }

    public PersonnelleException(Throwable cause) {
        super(cause);
    }
}
