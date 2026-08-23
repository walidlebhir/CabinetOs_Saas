package com.OS.ClinicOs.shared.exception.exception_per;

public class RendezvousDejaReserveException extends RuntimeException {

    public RendezvousDejaReserveException() {
        super("Rendezvous deja en reserver");
    }

    public RendezvousDejaReserveException(String message) {
        super(message);
    }
}
