package com.opspilot.tickets.domain.rules;

public class InvalidTicketTransitionException extends RuntimeException {
    public InvalidTicketTransitionException(String message) {
        super(message);
    }
}
