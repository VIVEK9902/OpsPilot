package com.opspilot.knowledge.infrastructure.repository;

import com.opspilot.knowledge.domain.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByNameAndVersion(String name, String version);
}
