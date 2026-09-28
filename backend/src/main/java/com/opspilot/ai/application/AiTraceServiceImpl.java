package com.opspilot.ai.application;

import com.opspilot.ai.domain.model.AiExecutionTrace;
import com.opspilot.ai.domain.model.AuthResult;
import com.opspilot.ai.domain.model.ToolStatus;
import com.opspilot.ai.infrastructure.repository.AiExecutionTraceRepository;
import com.opspilot.shared.infrastructure.web.CorrelationIdContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiTraceServiceImpl implements AiTraceService {
    
    private static final Logger log = LoggerFactory.getLogger(AiTraceServiceImpl.class);
    private final AiExecutionTraceRepository traceRepository;

    public AiTraceServiceImpl(AiExecutionTraceRepository traceRepository) {
        this.traceRepository = traceRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordTrace(String conversationId, String toolName, ToolStatus toolStatus, Long executionTimeMs, AuthResult authorizationResult, String failureCategory) {
        try {
            String correlationId = CorrelationIdContext.getCorrelationId();
            AiExecutionTrace trace = new AiExecutionTrace(conversationId, toolName, toolStatus, executionTimeMs, authorizationResult, correlationId, failureCategory);
            traceRepository.save(trace);
            
            log.info("AI_TRACE - Tool: {}, Status: {}, Auth: {}, Time: {}ms, Conversation: {}", toolName, toolStatus, authorizationResult, executionTimeMs, conversationId);
        } catch (Exception e) {
            log.error("Failed to write AI execution trace for tool: " + toolName, e);
        }
    }
}