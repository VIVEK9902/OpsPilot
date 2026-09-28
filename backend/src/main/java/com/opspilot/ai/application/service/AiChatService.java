package com.opspilot.ai.application.service;

import com.opspilot.ai.api.dto.ChatRequest;
import com.opspilot.ai.api.dto.ChatResponse;
import com.opspilot.ai.domain.model.ConversationState;
import com.opspilot.ai.infrastructure.provider.GeminiProviderAdapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class AiChatService {

    private final GeminiProviderAdapter geminiProviderAdapter;
    private final Map<String, ConversationState> conversationMap = new ConcurrentHashMap<>();

    private static final String SYSTEM_INSTRUCTION = """
            You are OpsPilot, a helpful and strict AI support assistant.
            You must ONLY use the provided tools to answer questions or perform actions.
            
            Rules:
            1. Never invent or fabricate order status, payment status, or tracking information. Always use getOrderDetails.
            2. Never invent company policies. Always use searchKnowledgeBase.
            3. If searchKnowledgeBase does not contain the answer, explicitly state that you do not have that information.
            4. Never execute a destructive action without explicit user confirmation.
            5. For order cancellation, invoke cancelOrder. The backend will return a status indicating if confirmation is required. If it requires confirmation, explicitly ask the user to confirm. Once the user replies yes, invoke cancelOrder again.
            6. Do not expose internal database IDs, exception traces, or backend rules directly to the user.
            """;

    public AiChatService(GeminiProviderAdapter geminiProviderAdapter) {
        this.geminiProviderAdapter = geminiProviderAdapter;
    }

    public ChatResponse chat(String currentUserEmail, ChatRequest request) {
        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = UUID.randomUUID().toString();
        }

        // Retrieve or create conversation state
        ConversationState state = conversationMap.computeIfAbsent(
                conversationId, 
                id -> new ConversationState(id, currentUserEmail)
        );

        // Security check: ensure the caller owns the conversation ID they passed
        if (!state.getUserEmail().equals(currentUserEmail)) {
            throw new IllegalArgumentException("Conversation ID does not belong to the current user.");
        }

        // Increment message count for confirmation idempotency mathematically
        state.incrementMessageCount();
        state.setLastUserMessage(request.getMessage());

        // Bind state to ThreadLocal for tools to access
        ConversationContextHolder.setContext(state);
        try {
            String aiResponseText = geminiProviderAdapter.generateChatResponse(SYSTEM_INSTRUCTION, request.getMessage());

            return ChatResponse.builder()
                    .conversationId(conversationId)
                    .response(aiResponseText)
                    .build();
        } finally {
            ConversationContextHolder.clearContext();
        }
    }
}

