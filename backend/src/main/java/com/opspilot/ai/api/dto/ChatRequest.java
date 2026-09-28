package com.opspilot.ai.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String conversationId;
    
    @NotBlank(message = "Message cannot be empty")
    private String message;
}
