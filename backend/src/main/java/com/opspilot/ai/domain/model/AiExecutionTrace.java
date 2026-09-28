package com.opspilot.ai.domain.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_execution_traces")
public class AiExecutionTrace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String conversationId;
    private String toolName;

    @Enumerated(EnumType.STRING)
    private ToolStatus toolStatus;

    private Long executionTimeMs;

    @Enumerated(EnumType.STRING)
    private AuthResult authorizationResult;

    private Instant timestamp;
    private String correlationId;
    private String failureCategory;

    protected AiExecutionTrace() {}

    public AiExecutionTrace(String conversationId, String toolName, ToolStatus toolStatus, Long executionTimeMs, AuthResult authorizationResult, String correlationId, String failureCategory) {
        this.conversationId = conversationId;
        this.toolName = toolName;
        this.toolStatus = toolStatus;
        this.executionTimeMs = executionTimeMs;
        this.authorizationResult = authorizationResult;
        this.timestamp = Instant.now();
        this.correlationId = correlationId;
        this.failureCategory = failureCategory;
    }

    public Long getId() { return id; }
    public String getConversationId() { return conversationId; }
    public String getToolName() { return toolName; }
    public ToolStatus getToolStatus() { return toolStatus; }
    public Long getExecutionTimeMs() { return executionTimeMs; }
    public AuthResult getAuthorizationResult() { return authorizationResult; }
    public Instant getTimestamp() { return timestamp; }
    public String getCorrelationId() { return correlationId; }
    public String getFailureCategory() { return failureCategory; }
}