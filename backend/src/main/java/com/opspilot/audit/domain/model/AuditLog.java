package com.opspilot.audit.domain.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long actorUserId;

    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;

    private String resourceId;

    @Enumerated(EnumType.STRING)
    private AuditResult result;

    private String reason;
    private Instant timestamp;
    private String correlationId;

    protected AuditLog() {}

    public AuditLog(Long actorUserId, AuditAction action, ResourceType resourceType, String resourceId, AuditResult result, String reason, String correlationId) {
        this.actorUserId = actorUserId;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.result = result;
        this.reason = reason;
        this.timestamp = Instant.now();
        this.correlationId = correlationId;
    }

    public Long getId() { return id; }
    public Long getActorUserId() { return actorUserId; }
    public AuditAction getAction() { return action; }
    public ResourceType getResourceType() { return resourceType; }
    public String getResourceId() { return resourceId; }
    public AuditResult getResult() { return result; }
    public String getReason() { return reason; }
    public Instant getTimestamp() { return timestamp; }
    public String getCorrelationId() { return correlationId; }
}