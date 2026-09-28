# OpsPilot Architecture

## Overview
OpsPilot is built using a **Modular Monolith** architecture powered by **Spring Boot 3**. This architectural style was chosen deliberately over microservices to maximize developer velocity, reduce operational complexity, and simplify transactional boundaries, while maintaining strict domain separation.

## Architectural Flow
`Frontend (React)` → `REST API` → `Spring Boot Modular Monolith` → `Application Services` → `PostgreSQL / PGVector`

## Core Principles

### 1. Deterministic Business Logic vs. Probabilistic AI
The fundamental architectural principle of OpsPilot is the strict separation of AI capabilities from core business execution.
- **AI handles language and ambiguity:** The Spring AI `ChatModel` is responsible for understanding user intent, extracting parameters, and determining *which* tools to call.
- **Application Services handle execution:** AI *does not* have direct access to the database or code execution environments. It simply requests a tool execution (e.g., `getOrderDetails`). The tool is backed by a strictly typed Spring `@Service` method that enforces all authorization, role-based access control, and business rules before executing.

### 2. Module Boundaries
The application is split into distinct domain packages (`auth`, `users`, `tickets`, `orders`, `knowledge`, `ai`, `audit`). Modules interact with each other strictly through service interfaces and DTOs (Data Transfer Objects), never by accessing each other's database entities directly.

## Key Capabilities

### Authentication & Authorization
- **JWT:** Stateless authentication via signed JSON Web Tokens.
- **Roles:** Strict Role-Based Access Control (RBAC) with `CUSTOMER`, `SUPPORT_AGENT`, and `ADMIN` tiers.
- **Object-Level Security:** Customers can only read/modify their *own* tickets and orders.

### AI Tool Calling & Cancellation Safety
- Tools are exposed to the LLM via Spring AI `@Tool` annotations.
- The `cancelOrder` tool implements an Idempotent, Two-Step Confirmation process.
- The AI cannot cancel an order without explicit customer confirmation, and the backend verifies ownership and cancellation eligibility (e.g., status is `PLACED`) before execution.

### Observability
- All database modifications and AI tool calls are recorded in an immutable `AuditLog`.
- AI conversations are bound to Correlation IDs, tracing exactly what prompts led to what tool executions.
