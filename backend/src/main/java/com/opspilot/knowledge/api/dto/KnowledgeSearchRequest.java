package com.opspilot.knowledge.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeSearchRequest {
    @NotBlank(message = "Query is required")
    private String query;
}
