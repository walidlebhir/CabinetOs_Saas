package com.OS.ClinicOs.shared.exception.exception_per;

public class AccountExisteException extends RuntimeException {

    public AccountExisteException() {
        super();
    }

    public AccountExisteException(String message) {
        super(message);
    }

    public AccountExisteException(String message, Throwable cause) {
        super(message, cause);
    }

    public AccountExisteException(Throwable cause) {
        super(cause);
    }
}
