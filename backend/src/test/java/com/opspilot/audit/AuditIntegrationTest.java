package com.opspilot.audit;

import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditLog;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;
import com.opspilot.audit.infrastructure.repository.AuditLogRepository;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import com.opspilot.shared.infrastructure.web.CorrelationIdContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class AuditIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private User testAdmin;
    private User testCustomer;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("TRUNCATE TABLE audit_logs CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE users CASCADE");

        testAdmin = userRepository.save(User.builder()
                .name("Test Admin")
                .email("admin@opspilot.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ADMIN)
                .build());

        testCustomer = userRepository.save(User.builder()
                .name("Test Customer")
                .email("customer@opspilot.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.CUSTOMER)
                .build());
    }

    @Test
    void shouldPersistAuditLog() {
        String corrId = UUID.randomUUID().toString();
        CorrelationIdContext.setCorrelationId(corrId);
        
        AuditLog log = new AuditLog(testAdmin.getId(), AuditAction.LOGIN, ResourceType.USER, testAdmin.getId().toString(), AuditResult.SUCCESS, "Login", corrId);
        auditLogRepository.save(log);

        List<AuditLog> logs = auditLogRepository.findAll();
        assertThat(logs).hasSize(1);
        assertThat(logs.get(0).getCorrelationId()).isEqualTo(corrId);
        assertThat(logs.get(0).getAction()).isEqualTo(AuditAction.LOGIN);
        
        CorrelationIdContext.clear();
    }

    @Test
    @WithMockUser(username = "admin@opspilot.com", roles = {"ADMIN"})
    void adminCanAccessAuditApi() throws Exception {
        mockMvc.perform(get("/api/v1/audit"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "customer@opspilot.com", roles = {"CUSTOMER"})
    void customerCannotAccessAuditApi() throws Exception {
        mockMvc.perform(get("/api/v1/audit"))
                .andExpect(status().isForbidden());
    }
}
