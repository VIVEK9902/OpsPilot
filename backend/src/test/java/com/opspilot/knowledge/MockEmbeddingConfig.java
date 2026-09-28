package com.opspilot.knowledge;

import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.embedding.EmbeddingResponseMetadata;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.ai.document.Document;

import java.util.List;
import java.util.stream.Collectors;

@TestConfiguration
public class MockEmbeddingConfig {

    @Bean
    @Primary
    public EmbeddingModel mockEmbeddingModel() {
        return new EmbeddingModel() {
            @Override
            public EmbeddingResponse call(EmbeddingRequest request) {
                float[] dummyVector = new float[1536];
                List<Embedding> embeddings = request.getInstructions().stream()
                        .map(text -> new Embedding(dummyVector, 0))
                        .collect(Collectors.toList());
                return new EmbeddingResponse(embeddings, new EmbeddingResponseMetadata());
            }

            @Override
            public float[] embed(String document) {
                return new float[1536];
            }

            @Override
            public float[] embed(Document document) {
                return new float[1536];
            }
            
            @Override
            public int dimensions() {
                return 1536;
            }
        };
    }
}
