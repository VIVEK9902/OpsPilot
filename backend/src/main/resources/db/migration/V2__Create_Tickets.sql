CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    assigned_agent_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_tickets_customer FOREIGN KEY (customer_id) REFERENCES users (id),
    CONSTRAINT fk_tickets_agent FOREIGN KEY (assigned_agent_id) REFERENCES users (id)
);

CREATE TABLE ticket_notes (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_notes_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES users (id)
);
