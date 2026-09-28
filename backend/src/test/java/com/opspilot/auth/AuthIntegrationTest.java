package com.opspilot.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opspilot.auth.api.dto.AuthResponse;
import com.opspilot.auth.api.dto.LoginRequest;
import com.opspilot.auth.api.dto.RegisterRequest;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@org.junit.jupiter.api.condition.DisabledIfSystemProperty(named = "os.name", matches = ".*[Ww]indows.*", disabledReason = "Docker Desktop 4.34.0 bug on Windows blocks Testcontainers. Run on Linux/CI or configure TCP.")
public class AuthIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("pgvector/pgvector:pg16");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // The test properties will also be loaded from application-test.yml
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_success() throws Exception {
        RegisterRequest req = new RegisterRequest("Integration User", "int@example.com", "password123");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.name").value("Integration User"))
                .andExpect(jsonPath("$.user.email").value("int@example.com"));

        User savedUser = userRepository.findByEmail("int@example.com").orElseThrow();
        assertThat(savedUser.getPasswordHash()).isNotEqualTo("password123");
        assertThat(savedUser.getPasswordHash()).startsWith("$2a$"); 
    }

    @Test
    void register_duplicateEmail_fails() throws Exception {
        RegisterRequest req = new RegisterRequest("User1", "dup@example.com", "pass");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        RegisterRequest req2 = new RegisterRequest("User2", "dup@example.com", "pass");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Data Integrity Violation"));
    }

    @Test
    void login_success() throws Exception {
        RegisterRequest regReq = new RegisterRequest("Login User", "login@example.com", "pass123");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)));

        LoginRequest loginReq = new LoginRequest("login@example.com", "pass123");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("login@example.com"));
    }

    @Test
    void login_invalidCredentials_fails() throws Exception {
        RegisterRequest regReq = new RegisterRequest("Login User", "login@example.com", "pass123");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)));

        LoginRequest loginReq = new LoginRequest("login@example.com", "wrongpass");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void protectedEndpoint_withValidJwt_success() throws Exception {
        RegisterRequest regReq = new RegisterRequest("JWT User", "jwt@example.com", "pass");
        String responseContent = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andReturn().getResponse().getContentAsString();

        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        String token = authResponse.getToken();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jwt@example.com"));
    }

    @Test
    void protectedEndpoint_withoutJwt_fails() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_withInvalidJwt_fails() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + "invalid_token_string"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminOnly_withAdminRole_success() throws Exception {
        RegisterRequest regReq = new RegisterRequest("Admin User", "admin@example.com", "pass");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)));
                
        // Manually update role to ADMIN in DB since register defaults to CUSTOMER
        User user = userRepository.findByEmail("admin@example.com").orElseThrow();
        user.setRole(com.opspilot.users.domain.model.Role.ADMIN);
        userRepository.save(user);
        
        // Login again to get a token with ADMIN role
        LoginRequest loginReq = new LoginRequest("admin@example.com", "pass");
        String loginResp = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andReturn().getResponse().getContentAsString();

        AuthResponse authResponse = objectMapper.readValue(loginResp, AuthResponse.class);
        
        mockMvc.perform(get("/api/v1/users/admin-only")
                        .header("Authorization", "Bearer " + authResponse.getToken()))
                .andExpect(status().isOk());
    }

    @Test
    void adminOnly_withCustomerRole_fails() throws Exception {
        RegisterRequest regReq = new RegisterRequest("Cust User", "cust@example.com", "pass");
        String responseContent = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andReturn().getResponse().getContentAsString();

        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        
        mockMvc.perform(get("/api/v1/users/admin-only")
                        .header("Authorization", "Bearer " + authResponse.getToken()))
                .andExpect(status().isForbidden());
    }
}

