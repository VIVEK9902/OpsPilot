package com.opspilot.users;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opspilot.shared.config.SecurityConfig;
import com.opspilot.shared.security.JwtAuthenticationFilter;
import com.opspilot.shared.security.JwtService;
import com.opspilot.users.api.controller.UserController;
import com.opspilot.users.api.dto.UpdateProfileRequest;
import com.opspilot.users.api.dto.UserDto;
import com.opspilot.users.application.service.UserService;
import com.opspilot.users.domain.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtService.class})
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Test
    @WithMockUser(username = "test@example.com")
    void getMyProfile_success() throws Exception {
        UserDto mockDto = UserDto.builder().id(1L).name("Test User").email("test@example.com").role(Role.CUSTOMER).build();
        when(userService.getProfile("test@example.com")).thenReturn(mockDto);

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateMyProfile_success() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest("Updated Name");
        UserDto mockDto = UserDto.builder().id(1L).name("Updated Name").email("test@example.com").role(Role.CUSTOMER).build();

        when(userService.updateProfile(eq("test@example.com"), any(UpdateProfileRequest.class)))
                .thenReturn(mockDto);

        mockMvc.perform(put("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void getMyProfile_withoutAuth_fails() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminOnly_withAdmin_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/users/admin-only"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void adminOnly_withCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/users/admin-only"))
                .andExpect(status().isForbidden());
    }
}
