package com.opspilot.orders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opspilot.auth.api.dto.LoginRequest;
import com.opspilot.auth.api.dto.RegisterRequest;
import com.opspilot.auth.api.dto.AuthResponse;
import com.opspilot.orders.domain.model.Order;
import com.opspilot.orders.domain.model.OrderStatus;
import com.opspilot.orders.domain.model.PaymentStatus;
import com.opspilot.orders.domain.model.ShipmentStatus;
import com.opspilot.orders.infrastructure.repository.OrderRepository;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers.")
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class OrderIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("pgvector/pgvector:pg16");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private String registerAndGetToken(String email, String role) throws Exception {
        RegisterRequest regReq = new RegisterRequest(email, email, "pass");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)));
                
        if ("ADMIN".equals(role) || "SUPPORT_AGENT".equals(role)) {
            User user = userRepository.findByEmail(email).orElseThrow();
            user.setRole(com.opspilot.users.domain.model.Role.valueOf(role));
            userRepository.save(user);
        }
        
        LoginRequest loginReq = new LoginRequest(email, "pass");
        String loginRes = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readValue(loginRes, AuthResponse.class).getToken();
    }

    @Test
    void customer_canRetrieveOwnOrder() throws Exception {
        String token = registerAndGetToken("ordercust1@example.com", "CUSTOMER");
        User customer = userRepository.findByEmail("ordercust1@example.com").orElseThrow();

        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PROCESSING)
                .paymentStatus(PaymentStatus.PAID)
                .shipmentStatus(ShipmentStatus.NOT_SHIPPED)
                
                .build();
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/orders/" + order.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSING"))
                .andExpect(jsonPath("$.cancellationEligible").value(true))
                .andExpect(jsonPath("$.mockPaymentSummary").exists())
                .andExpect(jsonPath("$.mockPaymentSummary.orderId").value(order.getId()));
    }

    @Test
    void customer_cannotRetrieveOtherCustomerOrder() throws Exception {
        String token1 = registerAndGetToken("ordercustA@example.com", "CUSTOMER");
        String token2 = registerAndGetToken("ordercustB@example.com", "CUSTOMER");
        User customerA = userRepository.findByEmail("ordercustA@example.com").orElseThrow();

        Order order = Order.builder()
                .customer(customerA)
                .status(OrderStatus.SHIPPED)
                .paymentStatus(PaymentStatus.PAID)
                .shipmentStatus(ShipmentStatus.IN_TRANSIT)
                
                .build();
        order = orderRepository.save(order);

        // token2 belongs to customer B, shouldn't access customer A's order
        mockMvc.perform(get("/api/v1/orders/" + order.getId())
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_canRetrieveAnyOrder() throws Exception {
        registerAndGetToken("ordercustC@example.com", "CUSTOMER");
        String adminToken = registerAndGetToken("orderadmin@example.com", "ADMIN");
        User customerC = userRepository.findByEmail("ordercustC@example.com").orElseThrow();

        Order order = Order.builder()
                .customer(customerC)
                .status(OrderStatus.DELIVERED)
                .paymentStatus(PaymentStatus.PAID)
                .shipmentStatus(ShipmentStatus.DELIVERED)
                
                .build();
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/orders/" + order.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));
    }
    
    @Test
    void unauthenticated_requestRejected() throws Exception {
        mockMvc.perform(get("/api/v1/orders/1001"))
                .andExpect(status().isForbidden());
    }
}

