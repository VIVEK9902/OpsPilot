package com.opspilot.auth.application.service;

import com.opspilot.auth.api.dto.AuthResponse;
import com.opspilot.auth.api.dto.LoginRequest;
import com.opspilot.auth.api.dto.RegisterRequest;
import com.opspilot.shared.security.CustomUserDetails;
import com.opspilot.shared.security.JwtService;
import com.opspilot.users.api.dto.UserDto;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.opspilot.audit.application.AuditService;
import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER) // Default role for open registration
                .build();

        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        auditService.record(user.getId(), AuditAction.LOGIN, ResourceType.USER, user.getId().toString(), AuditResult.SUCCESS, "Successful login");
        return AuthResponse.builder()
                .token(jwtToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        /*
         * NOTE: We intentionally do NOT audit LOGIN_FAILED events here.
         * The AuthenticationManager will throw a BadCredentialsException immediately on failure,
         * bypassing the subsequent execution. This intentional omission prevents unauthenticated
         * brute-force attacks from filling up our audit_logs table, protecting against DoS via storage exhaustion.
         */
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If we reach here, authentication was successful
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(); // Should not happen since auth passed

        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        
        auditService.record(user.getId(), AuditAction.LOGIN, ResourceType.USER, user.getId().toString(), AuditResult.SUCCESS, "Successful login");
        return AuthResponse.builder()
                .token(jwtToken)
                .user(UserDto.fromEntity(user))
                .build();
    }
}
