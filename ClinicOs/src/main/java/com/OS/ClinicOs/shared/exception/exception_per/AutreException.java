package com.OS.ClinicOs.shared.exception.exception_per;

public class AutreException extends RuntimeException {

    public AutreException() {
        super();
    }

    public AutreException(String message) {
        super(message);
    }

    public AutreException(String message, Throwable cause) {
        super(message, cause);
    }

    public AutreException(Throwable cause) {
        super(cause);
    }
}
