package com.opspilot.tickets.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketNoteResponse {
    private Long id;
    private Long ticketId;
    private Long authorId;
    private String authorName;
    private String note;
    private OffsetDateTime createdAt;
}
