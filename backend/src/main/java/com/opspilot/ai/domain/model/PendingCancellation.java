package com.opspilot.ai.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingCancellation {
    private String userEmail;
    private String conversationId;
    private Long orderId;
    private String actionType;
    private Instant createdAt;
    private Instant expiresAt;
}
