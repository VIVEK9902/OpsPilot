package com.opspilot.knowledge.api.dto;

import com.opspilot.knowledge.domain.model.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeSearchResponse {
    private String query;
    private List<SearchResult> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchResult {
        private String text;
        private String documentName;
        private String version;
        private AccessLevel accessLevel;
    }
}
