package com.opspilot.audit.application;

import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;

public interface AuditService {
    void record(Long actorUserId, AuditAction action, ResourceType resourceType, String resourceId, AuditResult result, String reason);
}