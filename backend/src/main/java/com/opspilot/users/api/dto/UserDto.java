package com.opspilot.users.api.dto;

import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
