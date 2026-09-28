# OpsPilot - Enterprise Operations & AI Platform

**One-line description:** A full-stack, modular-monolithic enterprise SaaS platform integrating role-based ticket management, logistics tracking, and a secure, tool-calling AI assistant.

## The Problem
Enterprise operations teams juggle disconnected tools for support tickets, logistics, and internal knowledge bases. AI solutions are often bolted-on as simple chatbots without real agency to execute actions securely.

## The Solution
OpsPilot centralizes these workflows into a single application. It introduces a highly-capable AI assistant that uses Retrieval-Augmented Generation (RAG) to answer questions, and secure Tool Calling to take real actions (like cancelling orders) on behalf of users, all strictly governed by backend authorization rules.

## Major Technical Features
- **Java/Spring Boot Modular Monolith:** Clean domain separation with REST APIs.
- **PostgreSQL + PGVector:** Combining relational data with high-dimensional vector embeddings in one database.
- **Spring AI:** Deep integration with OpenAI for LLM routing and Tool Calling.
- **Robust Observability:** Comprehensive audit logging tracking every database modification and AI execution trace.
- **Role-Based Security:** Granular object-level authorization across Customer, Support Agent, and Admin roles.
- **Vibrant Frontend:** A stunning, glassmorphic React/TypeScript SPA built with Tailwind CSS.

## Implemented vs. Simulated
- **Implemented:** True JWT Auth, Vector Embeddings, RAG, AI Tool Calling, Audit Logging, Relational Database persistence, Role authorization.
- **Simulated:** Payment processing (mock statuses), physical Courier integrations.
