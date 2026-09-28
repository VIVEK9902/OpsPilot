-- V9__Seed_Dev_Accounts.sql
-- Updates the existing customer seed with a valid bcrypt hash for 'password123'
UPDATE users 
SET password_hash = '$2a$10$mui4sQPO37v0C0N23wCNx.VXPerNyhkFh5JRwiGSMsL7CZtlaCgXi' 
WHERE email = 'seed_customer@opspilot.com';

-- Seed a SUPPORT_AGENT account with password 'password123'
INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
VALUES (9998, 'Seed Support Agent', 'support_agent@opspilot.com', '$2a$10$mui4sQPO37v0C0N23wCNx.VXPerNyhkFh5JRwiGSMsL7CZtlaCgXi', 'SUPPORT_AGENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Seed an ADMIN account with password 'password123'
INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
VALUES (9997, 'Seed Admin', 'admin@opspilot.com', '$2a$10$mui4sQPO37v0C0N23wCNx.VXPerNyhkFh5JRwiGSMsL7CZtlaCgXi', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
