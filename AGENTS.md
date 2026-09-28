# OpsPilot AI Coding Agents Guidelines

## 1. Project Purpose
OpsPilot is a production-minded enterprise support and operations platform designed to demonstrate strong Java/Spring Boot backend engineering together with practical AI integration. 
The project intentionally starts with limited, demonstrable functionality, while its internal boundaries are designed so future implementations can replace dummy components or be added alongside existing components without rewriting the rest of the system.

## 2. Current V1 Scope
- **IN SCOPE:** Authentication & RBAC (CUSTOMER, SUPPORT_AGENT, ADMIN), Support tickets, Mock order domain, Knowledge base + RAG, AI assistant with controlled tool calling, Cancellation safety gate, Audit logging.
- **NOT IN SCOPE FOR V1:** Real payments/shipping (only mocked), Unnecessary microservices, Analytics dashboard, Real e-commerce checkout, Model training.

## 3. Architecture Principles
- **Modular Monolith:** Build small, but design boundaries for growth. Outer/provider-specific details must not dictate core business logic.
- **Dependency Direction:** API/controller -> Application service -> Domain abstractions/rules -> Infrastructure implementations.
- **Stable Contracts:** Business capabilities communicate through stable service contracts. Use DTOs across boundaries (never expose JPA entities as the public contract).
- **Configuration-Driven:** Implementation selection (mock vs real) must be configuration-driven.

## 4. Module Boundaries
- `auth`: Authentication, JWT, password handling, security configuration. (No business logic)
- `users`: User profile operations.
- `tickets`: Ticket lifecycle, assignment, validation. (No AI orchestration)
- `orders`: Order queries, cancellation rules. (No LLM calls)
- `payments`: Payment abstraction and provider adapters.
- `knowledge`: Document ingestion, chunking, retrieval.
- `ai`: Assistant orchestration and tool definitions/handlers. (No direct DB access)
- `audit`: Audit event persistence.
- `shared`: Genuinely cross-cutting primitives only.

## 5. Coding Rules
- Use meaningful names and keep methods focused.
- Controllers contain **no business logic**. They validate/translate/route; application services decide.
- Prefer constructor injection.
- Use structured exceptions and centralized error handling.
- Write tests for business rules, not only happy-path controllers.
- Do not add libraries without a clear need.

## 6. Security Rules
- Authorization is independent of AI. The AI can request an action, but the backend decides whether it is permitted.
- Destructive operations are deterministic and require backend eligibility checks.
- Do not expose sensitive fields in DTOs.
- Secrets supplied through environment/configuration, never committed to Git.

## 7. AI/Tool-Calling Rules
- AI never directly accesses repositories or external APIs. 
- AI calls controlled tools; tools call application services.
- AI must not own: Authentication, Authorization, Cancellation eligibility, Provider credentials.
- AI tools names, schemas, and semantics are public internal contracts.

## 8. Database Rules
- PostgreSQL is the primary relational database. PGVector for embeddings.
- Database schema changes must be migration-controlled (e.g., Flyway) rather than manually edited.
- Keep JPA entities internal to persistence boundaries.

## 9. API Rules
- Use `/api/v1` for public APIs.
- Use consistent HTTP status codes and structured error responses.
- Version important contracts.
- Document endpoints with OpenAPI.

## 10. Testing Requirements
- Unit tests for domain logic (cancellation rules, ticket transitions).
- Service tests for business behavior.
- Integration tests using Testcontainers for PostgreSQL/PGVector.
- Security tests to ensure users cannot access other users' data.
- AI tool tests to prevent unsafe tool execution.

## 11. External Integration/Adapter Rules
- Business logic must not depend on external providers.
- Provider-specific code sits behind ports/interfaces and adapters.
- When adding a new integration: define the application-facing interface first, then create an adapter in infrastructure to normalize provider data into internal DTOs.

## 12. Scalability & Event Rules
- Use events (e.g., `OrderCancelledEvent`) only when asynchronous decoupling helps (e.g., Notifications).
- Do not add Kafka/events merely for decoration. V1 uses synchronous calls where immediate answers are needed.

## 13. Rules Against Over-Engineering
- Do not introduce microservices solely for theoretical scalability.
- Extract a service only when scale/ownership/deployment needs justify it.
- Keep V1 operationally simple.

## 14. Preservation of Contracts
- Preserve existing API and tool contracts unless a versioned change is explicitly requested.
- Do not rewrite unrelated modules when changing a feature.
- Make changes backward compatible when practical.

## 15. Documentation Updates
- When architecture changes or new dependencies/integrations are introduced, update the architecture documentation (Architecture Decision Records) in `docs/adr/` and `docs/architecture/`.

# Repository Structure Boundaries
- ackend/ is the dedicated Spring Boot application area. All backend code, tests, and configuration belong here.
- rontend/ is the frontend application boundary. No frontend code should be placed in the backend directory.
- Root directory is for repository-wide configurations like .github/, docs/, AGENTS.md, and README.md.
- Backend commands (like Maven and Docker Compose) should be run from inside the ackend/ directory (e.g., cd backend && mvn clean test or cd backend && docker compose up -d --build).

