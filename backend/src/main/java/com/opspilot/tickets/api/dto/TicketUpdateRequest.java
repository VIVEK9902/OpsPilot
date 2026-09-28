package com.opspilot.tickets.api.dto;

import com.opspilot.tickets.domain.model.TicketCategory;
import com.opspilot.tickets.domain.model.TicketPriority;
import com.opspilot.tickets.domain.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketUpdateRequest {
    private TicketPriority priority;
    private TicketStatus status;
    private TicketCategory category;
    private Long assignedAgentId;
}
