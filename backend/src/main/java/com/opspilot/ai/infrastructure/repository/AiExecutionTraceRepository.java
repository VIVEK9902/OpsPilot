package com.opspilot.ai.infrastructure.repository;

import com.opspilot.ai.domain.model.AiExecutionTrace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiExecutionTraceRepository extends JpaRepository<AiExecutionTrace, Long> {
}