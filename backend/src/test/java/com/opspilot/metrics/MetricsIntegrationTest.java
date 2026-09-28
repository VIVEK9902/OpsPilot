package com.opspilot.metrics;

import com.opspilot.orders.application.service.OrderService;
import com.opspilot.tickets.api.dto.TicketCreateRequest;
import com.opspilot.tickets.api.dto.TicketResponse;
import com.opspilot.tickets.api.dto.TicketUpdateRequest;
import com.opspilot.tickets.application.service.TicketService;
import com.opspilot.tickets.domain.model.TicketPriority;
import com.opspilot.tickets.domain.model.TicketCategory;
import com.opspilot.tickets.domain.model.TicketStatus;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import com.opspilot.orders.infrastructure.repository.OrderRepository;
import com.opspilot.orders.domain.model.Order;
import com.opspilot.orders.domain.model.OrderStatus;
import com.opspilot.orders.domain.model.PaymentStatus;
import com.opspilot.orders.domain.model.ShipmentStatus;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class MetricsIntegrationTest {

    @Autowired
    private MeterRegistry meterRegistry;

    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private User testCustomer;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("TRUNCATE TABLE tickets CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE orders CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE users CASCADE");

        testCustomer = userRepository.save(User.builder()
                .name("Test Customer")
                .email("customer@opspilot.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.SUPPORT_AGENT)
                .build());
    }

    private double getCount(String name) {
        var counter = meterRegistry.find(name).counter();
        return counter != null ? counter.count() : 0.0;
    }

    @Test
    void ticketMetrics_incrementOnSuccess() {
        double createdBefore = getCount("ticket.created");
        double updatedBefore = getCount("ticket.updated");

        TicketCreateRequest req = new TicketCreateRequest("Issue", "Desc", TicketPriority.LOW, TicketCategory.GENERAL);
        TicketResponse res = ticketService.createTicket(testCustomer.getEmail(), req);
        
        assertThat(getCount("ticket.created")).isEqualTo(createdBefore + 1.0);

        TicketUpdateRequest updateReq = new TicketUpdateRequest(TicketPriority.HIGH, TicketStatus.IN_PROGRESS, TicketCategory.TECHNICAL, null);
        ticketService.updateTicket(testCustomer.getEmail(), res.getId(), updateReq);
        
        assertThat(getCount("ticket.updated")).isEqualTo(updatedBefore + 1.0);
    }
    
    @Test
    void orderCancellationMetrics_incrementOnSuccessAndFailure() {
        double successBefore = getCount("order.cancellation.success");
        double failureBefore = getCount("order.cancellation.failure");
        
        Order eligibleOrder = orderRepository.save(Order.builder()
                .customer(testCustomer)
                .status(OrderStatus.PROCESSING)
                .paymentStatus(PaymentStatus.PAID)
                .shipmentStatus(ShipmentStatus.NOT_SHIPPED)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build());
                
        Order ineligibleOrder = orderRepository.save(Order.builder()
                .customer(testCustomer)
                .status(OrderStatus.SHIPPED)
                .paymentStatus(PaymentStatus.PAID)
                .shipmentStatus(ShipmentStatus.IN_TRANSIT)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build());

        orderService.cancelOrder(testCustomer.getEmail(), eligibleOrder.getId());
        assertThat(getCount("order.cancellation.success")).isEqualTo(successBefore + 1.0);
        
        assertThrows(IllegalStateException.class, () -> {
            orderService.cancelOrder(testCustomer.getEmail(), ineligibleOrder.getId());
        });
        assertThat(getCount("order.cancellation.failure")).isEqualTo(failureBefore + 1.0);
    }
}
