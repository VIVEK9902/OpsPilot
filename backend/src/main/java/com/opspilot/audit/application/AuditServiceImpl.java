package com.opspilot.audit.application;

import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditLog;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;
import com.opspilot.audit.infrastructure.repository.AuditLogRepository;
import com.opspilot.shared.infrastructure.web.CorrelationIdContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditServiceImpl implements AuditService {
    
    private static final Logger log = LoggerFactory.getLogger(AuditServiceImpl.class);
    private final AuditLogRepository auditLogRepository;

    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(Long actorUserId, AuditAction action, ResourceType resourceType, String resourceId, AuditResult result, String reason) {
        try {
            String correlationId = CorrelationIdContext.getCorrelationId();
            AuditLog auditLog = new AuditLog(actorUserId, action, resourceType, resourceId, result, reason, correlationId);
            auditLogRepository.save(auditLog);
            
            log.info("AUDIT - Action: {}, Result: {}, Actor: {}, Resource: {}-{}", action, result, actorUserId, resourceType, resourceId);
        } catch (Exception e) {
            // We do not want an audit log failure to rollback a critical business transaction.
            log.error("Failed to write audit log for action: " + action, e);
        }
    }
}