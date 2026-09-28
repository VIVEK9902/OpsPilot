package com.opspilot.ai.domain.model;

import lombok.Data;

@Data
public class ConversationState {
    private final String conversationId;
    private final String userEmail;
    private int userMessageCount = 0;
    private String lastUserMessage;
    private PendingCancellation pendingCancellation;

    public ConversationState(String conversationId, String userEmail) {
        this.conversationId = conversationId;
        this.userEmail = userEmail;
    }

    public void incrementMessageCount() {
        this.userMessageCount++;
    }
}
