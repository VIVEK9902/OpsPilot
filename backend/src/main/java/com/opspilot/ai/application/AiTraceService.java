package com.opspilot.ai.application;

import com.opspilot.ai.domain.model.AuthResult;
import com.opspilot.ai.domain.model.ToolStatus;

public interface AiTraceService {
    void recordTrace(String conversationId, String toolName, ToolStatus toolStatus, Long executionTimeMs, AuthResult authorizationResult, String failureCategory);
}