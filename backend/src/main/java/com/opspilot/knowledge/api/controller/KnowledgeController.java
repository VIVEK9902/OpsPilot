package com.opspilot.knowledge.api.controller;

import com.opspilot.knowledge.api.dto.IngestDocumentRequest;
import com.opspilot.knowledge.api.dto.KnowledgeSearchRequest;
import com.opspilot.knowledge.api.dto.KnowledgeSearchResponse;
import com.opspilot.knowledge.application.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/knowledge")
@RequiredArgsConstructor
@Tag(name = "Knowledge Base", description = "Document ingestion and RAG semantic search")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @Operation(summary = "Ingest Document", description = "Authorized ADMIN only. Ingests, chunks, and vectorizes a document.")
    @PostMapping("/documents")
    public ResponseEntity<Void> ingestDocument(
            Authentication authentication,
            @Valid @RequestBody IngestDocumentRequest request
    ) {
        knowledgeService.ingestDocument(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Knowledge Search", description = "Semantic search filtered by user access level.")
    @PostMapping("/search")
    public ResponseEntity<KnowledgeSearchResponse> search(
            Authentication authentication,
            @Valid @RequestBody KnowledgeSearchRequest request
    ) {
        KnowledgeSearchResponse response = knowledgeService.search(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
