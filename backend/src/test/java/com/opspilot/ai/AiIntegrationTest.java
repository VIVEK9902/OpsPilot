package com.opspilot.ai;

import com.opspilot.ai.application.service.AiChatService;
import com.opspilot.ai.application.service.ConversationContextHolder;
import com.opspilot.ai.domain.model.ConversationState;
import com.opspilot.ai.infrastructure.tool.OpsPilotToolsConfig;
import com.opspilot.ai.api.dto.ChatRequest;

import com.opspilot.orders.domain.model.Order;
import com.opspilot.orders.domain.model.OrderStatus;
import com.opspilot.orders.infrastructure.repository.OrderRepository;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.Generation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class AiIntegrationTest {

    @Autowired
    private OpsPilotToolsConfig toolsConfig;

    @Autowired
    private AiChatService aiChatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @MockBean
    private ChatModel chatModel;

    private User testCustomer;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("TRUNCATE TABLE tickets, orders, users CASCADE");

        testCustomer = new User();
        testCustomer.setEmail("customer@example.com");
        testCustomer.setPasswordHash("hash");
        testCustomer.setName("John Doe");
        
        testCustomer.setRole(Role.CUSTOMER);
        userRepository.save(testCustomer);

        testOrder = Order.builder()
                .customer(testCustomer)
                .status(OrderStatus.PROCESSING)
                .paymentStatus(com.opspilot.orders.domain.model.PaymentStatus.PAID)
                .shipmentStatus(com.opspilot.orders.domain.model.ShipmentStatus.NOT_SHIPPED)
                .build();
        orderRepository.save(testOrder);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testCustomer.getEmail(), null, List.of(() -> "ROLE_CUSTOMER"))
        );
        
        org.springframework.ai.chat.messages.AssistantMessage am = new org.springframework.ai.chat.messages.AssistantMessage("Mock response");
        org.springframework.ai.chat.model.ChatResponse mockResponse = new org.springframework.ai.chat.model.ChatResponse(List.of(new Generation(am)));
        when(chatModel.call(any(org.springframework.ai.chat.prompt.Prompt.class))).thenReturn(mockResponse);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
        ConversationContextHolder.clearContext();
    }

    @Test
    void testGetOrderDetailsTool_Success() {
        Function<OpsPilotToolsConfig.OrderIdRequest, Object> tool = toolsConfig.getOrderDetailsTool();
        Object response = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertNotNull(response);
        assertTrue(response.toString().contains("PROCESSING"));
    }

    @Test
    void testSearchKnowledgeBaseTool_Success() {
        Function<OpsPilotToolsConfig.SearchRequest, Object> tool = toolsConfig.searchKnowledgeBaseTool();
        Object response = tool.apply(new OpsPilotToolsConfig.SearchRequest("refund policy"));
        assertNotNull(response);
    }

    @Test
    void testCreateTicketTool_Success() {
        Function<OpsPilotToolsConfig.TicketRequest, Object> tool = toolsConfig.createTicketTool();
        Object response = tool.apply(new OpsPilotToolsConfig.TicketRequest("Broken item", "My item arrived broken"));
        assertNotNull(response);
        assertTrue(response.toString().contains("Broken item"));
    }

    @Test
    void testCancelOrder_RequiresExplicitConfirmation() {
        Function<OpsPilotToolsConfig.OrderIdRequest, Object> tool = toolsConfig.cancelOrderTool();
        
        ConversationState state = new ConversationState("test-conv", testCustomer.getEmail());
        ConversationContextHolder.setContext(state);
        
        // 1. Initial request creates pending state
        Object response1 = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response1.toString().contains("REQUIRES_CONFIRMATION"));
        
        assertNotNull(state.getPendingCancellation());
        
        // 2. Unrelated message does NOT cancel
        state.setLastUserMessage("What is the refund policy?");
        Object response2 = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response2.toString().contains("REQUIRES_CONFIRMATION"));
        
        // 3. 'no' does NOT cancel
        state.setLastUserMessage("no");
        Object response3 = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response3.toString().contains("REQUIRES_CONFIRMATION"));
        
        // 3b. 'yesterday' does NOT cancel
        state.setLastUserMessage("yesterday");
        Object response3b = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response3b.toString().contains("REQUIRES_CONFIRMATION"));
        
        // 3c. 'yes but don't cancel it' does NOT cancel
        state.setLastUserMessage("yes but don't cancel it");
        Object response3c = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response3c.toString().contains("REQUIRES_CONFIRMATION"));
        
        // 3d. 'not now' does NOT cancel
        state.setLastUserMessage("not now");
        Object response3d = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response3d.toString().contains("REQUIRES_CONFIRMATION"));
        
        // 3e. 'yes.' with punctuation DOES cancel
        state.setLastUserMessage("yes.");
        Object response3e = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response3e.toString().contains("CANCELLATION_SUCCESSFUL"));
        assertNull(state.getPendingCancellation());
        

    }

    @Test
    void testCancelOrder_DifferentUserCannotConfirm() {
        Function<OpsPilotToolsConfig.OrderIdRequest, Object> tool = toolsConfig.cancelOrderTool();
        
        ConversationState state = new ConversationState("test-conv", testCustomer.getEmail());
        ConversationContextHolder.setContext(state);
        
        tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        
        // Hack the pending state to belong to someone else
        state.getPendingCancellation().setUserEmail("hacker@example.com");
        state.setLastUserMessage("yes");
        
        // Should not execute
        Object response = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response.toString().contains("REQUIRES_CONFIRMATION"));
    }

    @Test
    void testCancelOrder_ExpiredCannotConfirm() {
        Function<OpsPilotToolsConfig.OrderIdRequest, Object> tool = toolsConfig.cancelOrderTool();
        
        ConversationState state = new ConversationState("test-conv", testCustomer.getEmail());
        ConversationContextHolder.setContext(state);
        
        tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        
        state.getPendingCancellation().setExpiresAt(java.time.Instant.now().minusSeconds(10));
        state.setLastUserMessage("yes");
        
        Object response = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response.toString().contains("REQUIRES_CONFIRMATION"));
    }
    
    @Test
    void testCancelOrder_AlreadyCancelledIdempotent() {
        Function<OpsPilotToolsConfig.OrderIdRequest, Object> tool = toolsConfig.cancelOrderTool();
        
        ConversationState state = new ConversationState("test-conv", testCustomer.getEmail());
        ConversationContextHolder.setContext(state);
        
        testOrder.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(testOrder);
        
        Object response = tool.apply(new OpsPilotToolsConfig.OrderIdRequest(testOrder.getId()));
        assertTrue(response.toString().contains("CANCELLATION_SUCCESSFUL: Order " + testOrder.getId() + " was already cancelled."));
    }
}
