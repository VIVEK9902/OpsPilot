package com.opspilot.knowledge.application.service;

import com.opspilot.knowledge.api.dto.IngestDocumentRequest;
import com.opspilot.knowledge.domain.model.AccessLevel;
import com.opspilot.knowledge.infrastructure.repository.DocumentRepository;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class KnowledgeSeeder {

    private final DocumentRepository documentRepository;
    private final KnowledgeService knowledgeService;
    private final UserRepository userRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void seedKnowledgeBase() {
        if (documentRepository.count() > 0) {
            log.info("Knowledge base already seeded.");
            return;
        }

        log.info("Seeding V1 Knowledge Base...");

        // Ensure we have an admin user to ingest the docs
        User admin = userRepository.findByEmail("seed_admin_kb@opspilot.com").orElseGet(() -> {
            User newUser = User.builder()
                    .name("Knowledge Base Admin")
                    .email("seed_admin_kb@opspilot.com")
                    .passwordHash("dummy")
                    .role(Role.ADMIN)
                    .build();
            return userRepository.save(newUser);
        });

        String adminEmail = admin.getEmail();

        List<IngestDocumentRequest> docs = List.of(
            new IngestDocumentRequest(
                "Refund Policy", "1.0", AccessLevel.PUBLIC,
                "Customers can request a refund within 30 days of their original purchase. " +
                "To process a refund, the order status must be DELIVERED and a support ticket must be opened."
            ),
            new IngestDocumentRequest(
                "Shipping Policy", "1.0", AccessLevel.PUBLIC,
                "Standard shipping takes 3-5 business days. Expedited shipping takes 1-2 business days. " +
                "Orders are processed within 24 hours of payment confirmation."
            ),
            new IngestDocumentRequest(
                "FAQ", "1.0", AccessLevel.CUSTOMER,
                "Q: How do I track my order? A: Check the orders tab in your dashboard.\n" +
                "Q: Can I change my address? A: Only if the shipment status is NOT_SHIPPED."
            ),
            new IngestDocumentRequest(
                "Support SOP", "1.0", AccessLevel.SUPPORT,
                "When a customer requests an address change, verify their identity first. " +
                "If the order is already IN_TRANSIT, inform them it cannot be changed. " +
                "If a refund is requested, always verify the 30-day window using the order's created_at date."
            ),
            new IngestDocumentRequest(
                "Internal Operations Guide", "1.0", AccessLevel.ADMIN,
                "System administrators should review the postgres database logs weekly. " +
                "Do not grant SUPPORT role to temporary contractors without manager approval."
            )
        );

        for (IngestDocumentRequest req : docs) {
            try {
                knowledgeService.ingestDocument(adminEmail, req);
                log.info("Seeded document: {}", req.getName());
            } catch (Exception e) {
                log.error("Failed to seed document: " + req.getName(), e);
            }
        }
        
        log.info("Knowledge Base seeding complete.");
    }
}

