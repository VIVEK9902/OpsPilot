package com.opspilot.ai.api.controller;

import com.opspilot.ai.api.dto.ChatRequest;
import com.opspilot.ai.api.dto.ChatResponse;
import com.opspilot.ai.application.service.AiChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "OpsPilot AI Orchestration Layer")
public class AiChatController {

    private final AiChatService aiChatService;

    @Operation(summary = "Chat with OpsPilot Assistant")
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            Authentication authentication,
            @Valid @RequestBody ChatRequest request
    ) {
        ChatResponse response = aiChatService.chat(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
