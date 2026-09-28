package com.opspilot.knowledge.application.service;

import com.opspilot.knowledge.api.dto.IngestDocumentRequest;
import com.opspilot.knowledge.api.dto.KnowledgeSearchRequest;
import com.opspilot.knowledge.api.dto.KnowledgeSearchResponse;
import com.opspilot.knowledge.domain.model.AccessLevel;
import com.opspilot.knowledge.domain.model.Document;
import com.opspilot.knowledge.infrastructure.repository.DocumentRepository;
import com.opspilot.shared.exception.ResourceNotFoundException;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final VectorStore vectorStore;
    private final DocumentCleaner documentCleaner;
    private final MeterRegistry meterRegistry;

    @Value("${opspilot.knowledge.chunking.size:500}")
    private int chunkSize;

    @Value("${opspilot.knowledge.chunking.overlap:50}")
    private int chunkOverlap;
    
    @Value("${opspilot.knowledge.search.top-k:5}")
    private int topK;

    @Transactional
    public Document ingestDocument(String currentUserEmail, IngestDocumentRequest request) {
        User user = getUserByEmail(currentUserEmail);

        // Only Admin can ingest documents in V1 (per prompt)
        if (user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admins can ingest knowledge documents.");
        }

        // 1. Check if document exists and create/update entity
        Optional<Document> existing = documentRepository.findByNameAndVersion(request.getName(), request.getVersion());
        Document doc;
        if (existing.isPresent()) {
            doc = existing.get();
            // Optional: delete old vectors associated with this document ID if updating
            // For V1, we assume ingest is create-only or we don't delete old chunks.
            // Spring AI PgVectorStore doesn't easily expose delete by metadata, so we just overwrite metadata or create new.
            throw new IllegalArgumentException("Document with this name and version already exists.");
        } else {
            doc = Document.builder()
                    .name(request.getName())
                    .version(request.getVersion())
                    .accessLevel(request.getAccessLevel())
                    .build();
            doc = documentRepository.save(doc);
        }

        // 2. Clean Text
        String cleanedContent = documentCleaner.clean(request.getContent());
        if (cleanedContent.isBlank()) {
            throw new IllegalArgumentException("Document content cannot be empty after cleaning.");
        }

        // 3. Chunking using Spring AI TokenTextSplitter
        TokenTextSplitter splitter = new TokenTextSplitter(chunkSize, chunkSize, chunkOverlap, chunkSize, true);
        
        // Spring AI Document is our conceptual DocumentChunk
        org.springframework.ai.document.Document springAiDoc = new org.springframework.ai.document.Document(cleanedContent);
        
        // Perform splitting
        List<org.springframework.ai.document.Document> chunks = splitter.apply(List.of(springAiDoc));

        // 4. Attach Metadata
        for (int i = 0; i < chunks.size(); i++) {
            org.springframework.ai.document.Document chunk = chunks.get(i);
            chunk.getMetadata().put("documentId", doc.getId());
            chunk.getMetadata().put("documentName", doc.getName());
            chunk.getMetadata().put("version", doc.getVersion());
            chunk.getMetadata().put("accessLevel", doc.getAccessLevel().name());
            chunk.getMetadata().put("chunkIndex", i);
        }

        // 5. Embedding & PGVector Storage
        log.info("Persisting {} chunks for document '{}' v{}", chunks.size(), doc.getName(), doc.getVersion());
        vectorStore.add(chunks);

        return doc;
    }

    @Transactional(readOnly = true)
    public KnowledgeSearchResponse search(String currentUserEmail, KnowledgeSearchRequest request) {
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            return doSearch(currentUserEmail, request);
        } finally {
            sample.stop(meterRegistry.timer("rag.retrieval", "operation", "search"));
        }
    }

    private KnowledgeSearchResponse doSearch(String currentUserEmail, KnowledgeSearchRequest request) {
        User user = getUserByEmail(currentUserEmail);

        // 1. Determine Allowed Access Levels
        String filterExpression = buildAccessLevelFilter(user.getRole());

        // 2. Semantic Search
        log.info("Searching knowledge base. Query: '{}', Filter: {}", request.getQuery(), filterExpression);
        SearchRequest searchRequest = SearchRequest.query(request.getQuery())
                .withTopK(topK)
                .withFilterExpression(filterExpression);

        List<org.springframework.ai.document.Document> topChunks = vectorStore.similaritySearch(searchRequest);

        // 3. Map to DTO
        List<KnowledgeSearchResponse.SearchResult> results = topChunks.stream().map(chunk -> {
            Map<String, Object> meta = chunk.getMetadata();
            return KnowledgeSearchResponse.SearchResult.builder()
                    .text(chunk.getContent())
                    .documentName((String) meta.get("documentName"))
                    .version((String) meta.get("version"))
                    .accessLevel(AccessLevel.valueOf((String) meta.get("accessLevel")))
                    .build();
        }).collect(Collectors.toList());

        return KnowledgeSearchResponse.builder()
                .query(request.getQuery())
                .results(results)
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /**
     * RAG Access Control logic.
     * Must execute BEFORE chunk retrieval!
     */
    private String buildAccessLevelFilter(Role role) {
        if (role == Role.ADMIN) {
            return "accessLevel in ['PUBLIC', 'CUSTOMER', 'SUPPORT', 'ADMIN']";
        } else if (role == Role.SUPPORT_AGENT) {
            return "accessLevel in ['PUBLIC', 'CUSTOMER', 'SUPPORT']";
        } else {
            // CUSTOMER or fallback
            return "accessLevel in ['PUBLIC', 'CUSTOMER']";
        }
    }
}

