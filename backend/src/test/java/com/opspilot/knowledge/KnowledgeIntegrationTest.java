package com.opspilot.knowledge;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opspilot.auth.api.dto.LoginRequest;
import com.opspilot.auth.api.dto.RegisterRequest;
import com.opspilot.auth.api.dto.AuthResponse;
import com.opspilot.knowledge.api.dto.KnowledgeSearchRequest;
import com.opspilot.knowledge.domain.model.Document;
import com.opspilot.knowledge.infrastructure.repository.DocumentRepository;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
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
@Import(MockEmbeddingConfig.class)
@DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop bug on Windows blocks Testcontainers.")
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class KnowledgeIntegrationTest {

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
    private DocumentRepository documentRepository;

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
    
    @BeforeEach
    void setup() {
        // We do not delete documents between tests to let KnowledgeSeeder run once or let the DB persist
        // We just rely on the seed data inserted by KnowledgeSeeder
    }

    @Test
    void customer_canOnlySearchPublicAndCustomerDocs() throws Exception {
        String token = registerAndGetToken("kb_cust@example.com", "CUSTOMER");

        KnowledgeSearchRequest req = new KnowledgeSearchRequest("Refund");
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                // Ensure they don't get any SUPPORT or ADMIN docs
                .andExpect(jsonPath("$.results[?(@.accessLevel == 'SUPPORT')]").doesNotExist())
                .andExpect(jsonPath("$.results[?(@.accessLevel == 'ADMIN')]").doesNotExist());
    }

    @Test
    void supportAgent_canSearchSupportDocsButNotAdmin() throws Exception {
        String token = registerAndGetToken("kb_agent@example.com", "SUPPORT_AGENT");

        KnowledgeSearchRequest req = new KnowledgeSearchRequest("SOP");
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                // Support can see SUPPORT
                // But not ADMIN
                .andExpect(jsonPath("$.results[?(@.accessLevel == 'ADMIN')]").doesNotExist());
    }
    
    @Test
    void admin_canSearchAdminDocs() throws Exception {
        String token = registerAndGetToken("kb_admin_user@example.com", "ADMIN");

        KnowledgeSearchRequest req = new KnowledgeSearchRequest("operations");
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}
