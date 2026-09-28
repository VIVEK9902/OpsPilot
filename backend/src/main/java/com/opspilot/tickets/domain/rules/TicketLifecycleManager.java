package com.opspilot.tickets.domain.rules;

import com.opspilot.tickets.domain.model.TicketStatus;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.Map;

@Component
public class TicketLifecycleManager {

    private static final Map<TicketStatus, Set<TicketStatus>> VALID_TRANSITIONS = Map.of(
        TicketStatus.OPEN, Set.of(TicketStatus.IN_PROGRESS, TicketStatus.CLOSED),
        TicketStatus.IN_PROGRESS, Set.of(TicketStatus.WAITING_FOR_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.CLOSED),
        TicketStatus.WAITING_FOR_CUSTOMER, Set.of(TicketStatus.IN_PROGRESS, TicketStatus.CLOSED),
        TicketStatus.RESOLVED, Set.of(TicketStatus.OPEN, TicketStatus.CLOSED),
        TicketStatus.CLOSED, Set.of(TicketStatus.OPEN) // allow reopening if needed
    );

    public void validateTransition(TicketStatus currentStatus, TicketStatus newStatus) {
        if (currentStatus == newStatus) {
            return; // no-op
        }
        
        Set<TicketStatus> allowed = VALID_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new InvalidTicketTransitionException(
                "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }
    }
}
