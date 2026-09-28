package com.opspilot.tickets.api.dto;

import com.opspilot.tickets.domain.model.TicketCategory;
import com.opspilot.tickets.domain.model.TicketPriority;
import com.opspilot.tickets.domain.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long assignedAgentId;
    private String assignedAgentName;
    private String title;
    private String description;
    private TicketPriority priority;
    private TicketStatus status;
    private TicketCategory category;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
