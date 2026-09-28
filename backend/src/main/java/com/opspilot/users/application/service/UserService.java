package com.opspilot.users.application.service;

import com.opspilot.users.api.dto.UpdateProfileRequest;
import com.opspilot.users.api.dto.UserDto;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setName(request.getName());
        user = userRepository.save(user);
        
        return UserDto.fromEntity(user);
    }
}
