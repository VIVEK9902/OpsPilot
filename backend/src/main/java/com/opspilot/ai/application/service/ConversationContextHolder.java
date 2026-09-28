package com.opspilot.ai.application.service;

import com.opspilot.ai.domain.model.ConversationState;

public class ConversationContextHolder {
    private static final ThreadLocal<ConversationState> CONTEXT = new ThreadLocal<>();

    public static void setContext(ConversationState state) {
        CONTEXT.set(state);
    }

    public static ConversationState getContext() {
        return CONTEXT.get();
    }

    public static void clearContext() {
        CONTEXT.remove();
    }
}
