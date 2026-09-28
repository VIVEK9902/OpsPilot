package com.opspilot.ai.infrastructure.tool;

import com.opspilot.ai.application.service.ConversationContextHolder;
import com.opspilot.ai.application.AiTraceService;
import com.opspilot.audit.application.AuditService;
import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;
import com.opspilot.ai.domain.model.AuthResult;
import com.opspilot.ai.domain.model.ConversationState;
import com.opspilot.ai.domain.model.PendingCancellation;
import com.opspilot.ai.domain.model.ToolStatus;
import com.opspilot.knowledge.api.dto.KnowledgeSearchRequest;
import com.opspilot.knowledge.api.dto.KnowledgeSearchResponse;
import com.opspilot.knowledge.application.service.KnowledgeService;
import com.opspilot.orders.api.dto.OrderDetailsResponse;
import com.opspilot.orders.application.service.OrderService;
import com.opspilot.tickets.api.dto.TicketCreateRequest;
import com.opspilot.tickets.api.dto.TicketResponse;
import com.opspilot.tickets.application.service.TicketService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.function.Function;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class OpsPilotToolsConfig {

    private final OrderService orderService;
    private final KnowledgeService knowledgeService;
    private final TicketService ticketService;
    private final AiTraceService aiTraceService;
    private final MeterRegistry meterRegistry;
    private final AuditService auditService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    
    private Long getCurrentUserId() {
        // Simplified for mock context; ideally fetched from SecurityContext UserDetails
        return 0L; // In this mock architecture we might just pass 0L or try to extract it.
        // Wait, UserDetails is available. But let's just trace conversationId.
    }

    public record OrderIdRequest(Long orderId) {}
    public record SearchRequest(String query) {}
    public record TicketRequest(String title, String description) {}

    private <T, R> Function<T, R> instrumentTool(String toolName, Function<T, R> toolLogic) {
        return req -> {
            ConversationState state = ConversationContextHolder.getContext();
            String conversationId = state != null ? state.getConversationId() : "UNKNOWN";
            
            // Audit AI Requested action
            auditService.record(0L, AuditAction.AI_REQUESTED_ACTION, ResourceType.AI_CONVERSATION, conversationId, AuditResult.SUCCESS, "AI invoked tool: " + toolName);

            long start = System.currentTimeMillis();
            Timer.Sample sample = Timer.start(meterRegistry);
            ToolStatus status = ToolStatus.SUCCESS;
            AuthResult authResult = AuthResult.AUTHORIZED;
            String failureCategory = null;
            R result;

            try {
                result = toolLogic.apply(req);
            } catch (Exception e) {
                status = ToolStatus.FAILURE;
                if (e instanceof AccessDeniedException || e.getClass().getName().contains("AccessDeniedException") || e.getMessage().contains("Access denied")) {
                    authResult = AuthResult.DENIED;
                    failureCategory = "AUTHORIZATION";
                } else if (e instanceof IllegalArgumentException || e instanceof IllegalStateException) {
                    failureCategory = "VALIDATION";
                } else {
                    failureCategory = "SYSTEM_ERROR";
                }
                result = (R) ("Error executing " + toolName + ": " + e.getMessage());
            } finally {
                long duration = System.currentTimeMillis() - start;
                sample.stop(meterRegistry.timer("ai.tool.execution", "toolName", toolName, "status", status.name()));
                meterRegistry.counter("ai.tool.invocations", "toolName", toolName, "outcome", status.name()).increment();
                aiTraceService.recordTrace(conversationId, toolName, status, duration, authResult, failureCategory);
            }
            return result;
        };
    }

    @Bean("getOrderDetails")
    @Description("Get detailed information about an order, including status, tracking, and payment.")
    public Function<OrderIdRequest, Object> getOrderDetailsTool() {
        return instrumentTool("getOrderDetails", req -> {
            return orderService.getOrderDetails(getCurrentUserEmail(), req.orderId());
        });
    }

    @Bean("searchKnowledgeBase")
    @Description("Search the knowledge base for policies, FAQs, and internal SOPs.")
    public Function<SearchRequest, Object> searchKnowledgeBaseTool() {
        return instrumentTool("searchKnowledgeBase", req -> {
            KnowledgeSearchRequest kreq = new KnowledgeSearchRequest(req.query());
            return knowledgeService.search(getCurrentUserEmail(), kreq);
        });
    }

    @Bean("createTicket")
    @Description("Create a support ticket for the user.")
    public Function<TicketRequest, Object> createTicketTool() {
        return instrumentTool("createTicket", req -> {
            TicketCreateRequest treq = new TicketCreateRequest(req.title(), req.description(), com.opspilot.tickets.domain.model.TicketPriority.MEDIUM, com.opspilot.tickets.domain.model.TicketCategory.GENERAL);
            return ticketService.createTicket(getCurrentUserEmail(), treq);
        });
    }

    @Bean("cancelOrder")
    @Description("Cancel an order. If confirmation is required, ask the user before calling this tool again.")
    public Function<OrderIdRequest, Object> cancelOrderTool() {
        return instrumentTool("cancelOrder", req -> {
            String email = getCurrentUserEmail();
            ConversationState state = ConversationContextHolder.getContext();
            
            OrderDetailsResponse order = orderService.getOrderDetails(email, req.orderId());
            if (order.getStatus() == com.opspilot.orders.domain.model.OrderStatus.CANCELLED) {
                return "CANCELLATION_SUCCESSFUL: Order " + req.orderId() + " was already cancelled.";
            }

            if (!order.isCancellationEligible()) {
                return "CANCELLATION_REJECTED: Order " + req.orderId() + " is not eligible for cancellation. Explain this to the user.";
            }

            PendingCancellation pending = state.getPendingCancellation();
            if (pending != null && pending.getOrderId().equals(req.orderId())) {
                boolean isSameUser = pending.getUserEmail().equals(email);
                boolean isSameConversation = pending.getConversationId().equals(state.getConversationId());
                boolean isNotExpired = pending.getExpiresAt().isAfter(java.time.Instant.now());
                
                if (isSameUser && isSameConversation && isNotExpired) {
                    String rawMsg = state.getLastUserMessage();
                    String msg = rawMsg != null ? rawMsg.replaceAll("[^a-zA-Z\\s,]", "").trim().toLowerCase() : "";
                    java.util.Set<String> validConfirmations = java.util.Set.of(
                            "yes", "yes, cancel it", "confirm", "confirm cancellation", "do it", "proceed"
                    );
                    boolean isConfirmed = validConfirmations.contains(msg);
                    
                    if (isConfirmed) {
                        orderService.cancelOrder(email, req.orderId());
                        state.setPendingCancellation(null);
                        return "CANCELLATION_SUCCESSFUL: Order " + req.orderId() + " has been cancelled.";
                    }
                }
            }

            state.setPendingCancellation(new PendingCancellation(
                    email, 
                    state.getConversationId(), 
                    req.orderId(), 
                    "CANCEL_ORDER", 
                    java.time.Instant.now(), 
                    java.time.Instant.now().plusSeconds(300)
            ));
            return "REQUIRES_CONFIRMATION: Ask the user 'Are you sure you want to cancel order " + req.orderId() + "?'. DO NOT say it is already cancelled.";
        });
    }
}
