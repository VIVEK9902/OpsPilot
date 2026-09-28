CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255),
    resource_id VARCHAR(255),
    result VARCHAR(255) NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(255)
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_correlation_id ON audit_logs(correlation_id);

CREATE TABLE ai_execution_traces (
    id BIGSERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    tool_status VARCHAR(255) NOT NULL,
    execution_time_ms BIGINT,
    authorization_result VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(255),
    failure_category VARCHAR(255)
);

CREATE INDEX idx_ai_traces_timestamp ON ai_execution_traces(timestamp);
CREATE INDEX idx_ai_traces_conversation_id ON ai_execution_traces(conversation_id);
CREATE INDEX idx_ai_traces_tool_name ON ai_execution_traces(tool_name);
CREATE INDEX idx_ai_traces_correlation_id ON ai_execution_traces(correlation_id);
