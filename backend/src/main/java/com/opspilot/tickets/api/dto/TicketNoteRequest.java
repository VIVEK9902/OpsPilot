package com.opspilot.tickets.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketNoteRequest {
    @NotBlank(message = "Note content is required")
    private String note;
}
