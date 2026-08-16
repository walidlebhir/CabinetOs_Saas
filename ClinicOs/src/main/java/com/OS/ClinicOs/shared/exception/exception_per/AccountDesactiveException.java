package com.OS.ClinicOs.shared.exception.exception_per;

public class AccountDesactiveException extends RuntimeException {

    public AccountDesactiveException() {
        super();
    }

    public AccountDesactiveException(String message) {
        super(message);
    }

    public AccountDesactiveException(String message, Throwable cause) {
        super(message, cause);
    }

    public AccountDesactiveException(Throwable cause) {
        super(cause);
    }
}
