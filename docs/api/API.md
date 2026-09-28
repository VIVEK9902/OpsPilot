# REST API Documentation

OpsPilot exposes a strictly typed RESTful API. All protected endpoints require an `Authorization: Bearer <jwt>` header.

## Authentication (`/api/auth`)
- `POST /register`: Accepts `{ name, email, password }`. Returns `{ token, user }`.
- `POST /login`: Accepts `{ email, password }`. Returns `{ token, user }`.

## Support Tickets (`/api/tickets`)
- `GET /`: Returns tickets based on role (Customer = own tickets, Agent/Admin = all tickets).
- `POST /`: Create a new ticket `{ title, description, category, priority }`.
- `GET /{id}`: Retrieve full ticket details and notes.
- `PUT /{id}/status`: Update ticket status (Agent/Admin only).
- `POST /{id}/notes`: Add a note. Supports `internalOnly` flag for agents.

## Orders (`/api/orders`)
- `GET /`: Returns orders for the authenticated user.
- `GET /{id}`: Returns specific order details.
- `POST /{id}/cancel`: Submits a cancellation request. Fails if order is not `PLACED` or if user does not own it.

## Knowledge Base (`/api/knowledge`)
- `GET /search?q={query}`: Perform vector similarity search. Customers are restricted to public docs; Agents/Admins can see internal docs.
- `POST /seed`: (Admin only) Triggers background embedding generation and loads the V1 knowledge base.

## AI Assistant (`/api/ai`)
- `POST /chat`: Accepts `{ message }`. Returns `{ message, role, sources, toolCalls }`. Maintains session state in-memory.

## Audit Logs (`/api/audit`)
- `GET /`: (Admin only) Returns paginated system activity and security events.
