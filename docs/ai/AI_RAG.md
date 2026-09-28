# AI & RAG Capabilities

## Spring AI Integration
OpsPilot utilizes the `spring-ai-openai` module to interface with OpenAI's models (e.g., `gpt-4o-mini`). It heavily leverages the Spring AI Tool Calling API to bind Java methods to LLM functions.

## Retrieval-Augmented Generation (RAG)
OpsPilot embeds knowledge base documents into a PGVector-backed PostgreSQL database.
- **Ingestion:** Documents are loaded, split using a `TokenTextSplitter`, and embedded via OpenAI's `text-embedding-3-small`.
- **Retrieval:** When a user asks a question, the system queries PGVector for cosine similarity.
- **Access Control:** The RAG pipeline enforces role-based filtering (e.g., `metadata.internalOnly == false` for CUSTOMERS).

## Tool Calling (The AI's Actions)
The AI is provided with deterministic tools it can invoke:
- `getTicketStatus(ticketId)`
- `getOrderDetails(orderId)`
- `cancelOrder(orderId)`

These tools are wrappers around the core Application Services. If the AI hallucinates a tool call to an order the user does not own, the underlying service throws an `UnauthorizedException`.

## Cancellation Safety
The `cancelOrder` flow is a multi-step, highly restricted pipeline:
1. AI determines user wants to cancel.
2. AI calls `getOrderDetails` to check `cancellationEligible`.
3. AI asks the user for explicit confirmation.
4. User says "Yes".
5. AI calls `cancelOrder`.
6. Backend enforces eligibility and logs the action to the Audit system.
