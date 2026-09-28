package com.opspilot.knowledge.api.dto;

import com.opspilot.knowledge.domain.model.AccessLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngestDocumentRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Version is required")
    private String version;

    @NotNull(message = "Access level is required")
    private AccessLevel accessLevel;

    @NotBlank(message = "Content is required")
    private String content;
}
