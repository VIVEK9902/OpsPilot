# Deployment & DevOps

## Docker Architecture
OpsPilot relies heavily on Docker for deployment and local development.
- **PostgreSQL Database:** Powered by the `pgvector/pgvector:pg16` image to support vector embeddings natively within the relational DB.
- **Backend Application:** Built as a standard Docker image leveraging the `eclipse-temurin:21-jre` base image.

## CI/CD Pipeline
OpsPilot includes a robust GitHub Actions workflow (`.github/workflows/build.yml`) that triggers on push and pull requests.
1. **Backend Validation:** Installs JDK 21, sets up a PostgreSQL Testcontainer, runs `mvn test`, and packages the `.jar`.
2. **Frontend Validation:** Installs Node.js, runs `npm install`, validates TypeScript with `tsc`, and creates the production `dist` build via Vite.

## Environment Separation
No secrets are committed to the repository.
- `backend/.env.example` provides template variables (e.g., `OPENAI_API_KEY`).
- `frontend/.env.example` provides client configuration (e.g., `VITE_API_URL`).

## Production Considerations
In a true production environment:
1. `OPENAI_API_KEY` and `JWT_SECRET` must be injected via a secure vault or environment manager.
2. The frontend build should be hosted on a CDN (Vercel, CloudFront, Netlify).
3. AI Conversation State (currently in-memory) should be moved to Redis or PostgreSQL to support multi-node backend scaling.
