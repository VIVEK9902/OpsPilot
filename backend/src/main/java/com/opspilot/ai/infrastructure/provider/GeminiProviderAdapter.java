package com.opspilot.ai.infrastructure.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.FunctionCall;
import com.google.genai.types.FunctionDeclaration;
import com.google.genai.types.FunctionResponse;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.types.Schema;
import com.google.genai.types.Tool;
import com.google.genai.types.Type;
import com.opspilot.ai.infrastructure.tool.OpsPilotToolsConfig.OrderIdRequest;
import com.opspilot.ai.infrastructure.tool.OpsPilotToolsConfig.SearchRequest;
import com.opspilot.ai.infrastructure.tool.OpsPilotToolsConfig.TicketRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
public class GeminiProviderAdapter {

    private final Client client;
    private final Function<OrderIdRequest, Object> getOrderDetails;
    private final Function<SearchRequest, Object> searchKnowledgeBase;
    private final Function<TicketRequest, Object> createTicket;
    private final Function<OrderIdRequest, Object> cancelOrder;
    private final ObjectMapper objectMapper;
    private final Tool toolConfig;

    public GeminiProviderAdapter(
            @Value("${spring.ai.gemini.api-key}") String apiKey,
            Function<OrderIdRequest, Object> getOrderDetails,
            Function<SearchRequest, Object> searchKnowledgeBase,
            Function<TicketRequest, Object> createTicket,
            Function<OrderIdRequest, Object> cancelOrder,
            ObjectMapper objectMapper) {
        
        this.client = Client.builder().apiKey(apiKey).build();
        this.getOrderDetails = getOrderDetails;
        this.searchKnowledgeBase = searchKnowledgeBase;
        this.createTicket = createTicket;
        this.cancelOrder = cancelOrder;
        this.objectMapper = objectMapper;

        FunctionDeclaration getOrderDetailsDecl = FunctionDeclaration.builder()
                .name("getOrderDetails")
                .description("Get detailed information about an order, including status, tracking, and payment.")
                .parameters(Schema.builder()
                        .type(new Type("OBJECT"))
                        .properties(Map.of("orderId", Schema.builder().type(new Type("INTEGER")).build()))
                        .required(List.of("orderId"))
                        .build())
                .build();

        FunctionDeclaration searchKnowledgeBaseDecl = FunctionDeclaration.builder()
                .name("searchKnowledgeBase")
                .description("Search the knowledge base for policies, FAQs, and internal SOPs.")
                .parameters(Schema.builder()
                        .type(new Type("OBJECT"))
                        .properties(Map.of("query", Schema.builder().type(new Type("STRING")).build()))
                        .required(List.of("query"))
                        .build())
                .build();

        FunctionDeclaration createTicketDecl = FunctionDeclaration.builder()
                .name("createTicket")
                .description("Create a support ticket for the user.")
                .parameters(Schema.builder()
                        .type(new Type("OBJECT"))
                        .properties(Map.of(
                                "title", Schema.builder().type(new Type("STRING")).build(),
                                "description", Schema.builder().type(new Type("STRING")).build()
                        ))
                        .required(List.of("title", "description"))
                        .build())
                .build();

        FunctionDeclaration cancelOrderDecl = FunctionDeclaration.builder()
                .name("cancelOrder")
                .description("Cancel an order. If confirmation is required, ask the user before calling this tool again.")
                .parameters(Schema.builder()
                        .type(new Type("OBJECT"))
                        .properties(Map.of("orderId", Schema.builder().type(new Type("INTEGER")).build()))
                        .required(List.of("orderId"))
                        .build())
                .build();

        this.toolConfig = Tool.builder()
                .functionDeclarations(List.of(getOrderDetailsDecl, searchKnowledgeBaseDecl, createTicketDecl, cancelOrderDecl))
                .build();
    }

    public String generateChatResponse(String systemInstruction, String userMessage) {
        try {
            var chat = client.chats.create("gemini-3.5-flash", GenerateContentConfig.builder()
                    .systemInstruction(Content.builder().parts(List.of(Part.builder().text(systemInstruction).build())).build())
                    .tools(List.of(toolConfig))
                    .build());

            GenerateContentResponse response = chat.sendMessage(userMessage);

            // Handle tool calling loop
            int maxLoops = 5;
            while (response.functionCalls() != null && !response.functionCalls().isEmpty() && maxLoops-- > 0) {
                List<Part> functionResponseParts = new ArrayList<>();

                for (FunctionCall call : response.functionCalls()) {
                    String name = call.name().orElse("");
                    Map<String, Object> args = call.args().orElse(Map.of());
                    Object toolResult = null;

                    try {
                        switch (name) {
                            case "getOrderDetails" -> {
                                OrderIdRequest req = objectMapper.convertValue(args, OrderIdRequest.class);
                                toolResult = getOrderDetails.apply(req);
                            }
                            case "searchKnowledgeBase" -> {
                                SearchRequest req = objectMapper.convertValue(args, SearchRequest.class);
                                toolResult = searchKnowledgeBase.apply(req);
                            }
                            case "createTicket" -> {
                                TicketRequest req = objectMapper.convertValue(args, TicketRequest.class);
                                toolResult = createTicket.apply(req);
                            }
                            case "cancelOrder" -> {
                                OrderIdRequest req = objectMapper.convertValue(args, OrderIdRequest.class);
                                toolResult = cancelOrder.apply(req);
                            }
                            default -> toolResult = "Unknown tool: " + name;
                        }
                    } catch (Exception e) {
                        log.error("Tool execution error for {}", name, e);
                        toolResult = "Error: " + e.getMessage();
                    }

                    // Convert tool result back to a Map for FunctionResponse
                    Map<String, Object> responseMap;
                    if (toolResult instanceof String strResult) {
                        responseMap = Map.of("result", strResult);
                    } else {
                        responseMap = objectMapper.convertValue(toolResult, Map.class);
                    }

                    functionResponseParts.add(Part.builder()
                            .functionResponse(FunctionResponse.builder()
                                    .name(name)
                                    .response(responseMap)
                                    .build())
                            .build());
                }

                // Send function responses back to Gemini
                response = chat.sendMessage(Content.builder()
                        .role("user")
                        .parts(functionResponseParts)
                        .build());
            }

            return response.text();
        } catch (Exception e) {
            log.error("Error generating Gemini chat response", e);
            throw new RuntimeException("AI Provider Error: " + e.getMessage(), e);
        }
    }
}
