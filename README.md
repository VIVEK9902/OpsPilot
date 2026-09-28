# OpsPilot - Enterprise Operations & AI Platform

## 1. Project Overview
OpsPilot is a full-stack, modular-monolithic enterprise SaaS platform that seamlessly integrates role-based support ticketing, order logistics, and a secure, tool-calling AI assistant into a single unified workspace.

## 2. Problem Being Solved
Enterprise operations teams juggle disconnected tools for support, logistics, and knowledge retrieval. Current AI solutions are often bolted-on as read-only chatbots. OpsPilot centralizes these workflows and introduces an AI assistant with real *agency* to execute actions securely on behalf of users.

## 3. Key Capabilities
- Secure Authentication & Role-Based Access Control (RBAC).
- Complete Support Ticket lifecycle management.
- Order tracking and mock payment statuses.
- Full Retrieval-Augmented Generation (RAG) pipeline for knowledge queries.
- Deterministic AI Tool Calling (e.g., automated, safe order cancellations).
- Comprehensive Audit Logging and Observability.

## 4. Architecture Overview
OpsPilot is a **Modular Monolith**. It strictly separates AI capabilities from core business execution. The AI handles intent extraction and tool routing, but the actual execution of tasks is securely gated behind strictly-typed Spring Boot Application Services.

## 5. Backend Technology Stack
- **Java 21**
- **Spring Boot 3.3.x** (Web, Security, Data JPA, Validation)
- **Spring AI** (OpenAI integration)
- **PostgreSQL 16 + PGVector** (Relational & Vector data)
- **Flyway** (Database migrations)
- **Docker & Testcontainers**

## 6. Frontend Technology Stack
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4** (Glassmorphism & Vibrant Design System)
- **React Router**
- **TanStack React Query**

## 7. AI/RAG Architecture
- **Ingestion:** Documents are processed via Spring AI's `TokenTextSplitter` and embedded using OpenAI's `text-embedding-3-small`.
- **Vector DB:** Embeddings are stored natively in PostgreSQL using the `pgvector` extension.
- **Retrieval:** Cosine similarity search with strict metadata filtering based on the user's role.

## 8. Security Model
- **Authentication:** Stateless JWT-based authentication.
- **Encryption:** BCrypt for password hashing.
- **Execution Safety:** Tools exposed to the AI are heavily restricted. Actions like cancellation require a two-step explicit confirmation and enforce strict ownership checks before database execution.

## 9. Role Model
- **CUSTOMER:** Can only view/edit their own tickets and orders. Can only access public knowledge base articles.
- **SUPPORT_AGENT:** Can view/edit all tickets and view all orders. Can access internal knowledge base articles.
- **ADMIN:** Has access to system-level features like Audit Logs and knowledge base seeding.

## 10. Main Modules
- `auth`: JWT generation and validation.
- `users`: User entity and role definitions.
- `tickets`: Support ticket CRUD and notes.
- `orders`: Order entity and cancellation logic.
- `knowledge`: PGVector documents and RAG pipeline.
- `ai`: Spring AI ChatClient, Tool Calling, and tracing.
- `audit`: System-wide immutable logging.

## 11. Repository Structure
```
OpsPilot/
├── backend/          # Spring Boot Application
├── frontend/         # React Application
├── docs/             # Extensive Project Documentation
├── docker/           # Shared Docker scripts
├── .github/          # CI/CD Workflows
└── README.md
```

## 12. Prerequisites
- **Java 21**
- **Maven 3.9+**
- **Node.js 20+**
- **Docker Desktop**
- **OpenAI API Key**

## 13. Environment Variables
No secrets are committed to the repository. Reference the example files:
- `backend/.env.example`
- `frontend/.env.example`

## 14. Local Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
```

## 15. Local Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
```

## 16. Running Backend + Database
To launch the PostgreSQL database and the Spring Boot backend simultaneously:
```bash
cd backend
docker-compose up -d
mvn spring-boot:run
```

## 17. Running Frontend
```bash
cd frontend
npm run dev
```

## 18. Running the Complete Application
With the backend running on `localhost:8081` and the frontend running on `localhost:5173`, navigate to `http://localhost:5173` in your browser.

## 19. Docker Usage
To tear down the database and wipe volumes:
```bash
cd backend
docker-compose down -v
```

## 20. Testing
Backend tests utilize **Testcontainers** to spin up a real PostgreSQL container.
```bash
cd backend
mvn clean test
```

## 21. CI/CD
OpsPilot uses **GitHub Actions**. Upon push or pull request, the CI pipeline automatically:
- Provisions a PGVector Testcontainer.
- Executes the full Maven test suite.
- Builds the React frontend for production to verify TypeScript strictness.

## 22. API Overview
All protected endpoints require an `Authorization: Bearer <jwt>` header. Reference `docs/api/API.md` for a complete list of endpoints and DTOs.

## 23. AI Assistant Overview
The AI assistant maintains session state in-memory and can execute deterministic tools like `getOrderDetails` and `cancelOrder`. It requires explicit user confirmation for destructive actions.

## 24. RAG Overview
Knowledge is seeded via `POST /api/knowledge/seed` (Admin only). The AI will automatically query the vector database when the user asks policy or general knowledge questions.

## 25. Audit/Observability
Every database modification and AI tool execution is logged with a timestamp, actor, and result status. AI interactions generate a `Correlation ID` to bind prompts to the tools they trigger.

## 26. Deployment Information
The application is designed for standard cloud deployment. The backend compiles to a fat `.jar` and can be containerized using the provided `Dockerfile`. The frontend builds to static files (`npm run build`).

## 27. Known Limitations
- The AI conversation state is currently stored in-memory (ConcurrentHashMap). This is not scalable across multiple backend nodes.
- Payment systems are entirely mocked.
- Testcontainers can occasionally be slow to start on Windows environments via Docker Desktop.

## 28. Future Improvements
- Migrate AI conversation state to Redis for horizontal scalability.
- Implement an event-driven architecture (Kafka/RabbitMQ) for the audit logging system to decouple it from the main request thread.
- Integrate a real payment gateway (Stripe/Adyen) for true order processing.
