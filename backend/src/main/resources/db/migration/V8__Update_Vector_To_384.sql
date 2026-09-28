-- Truncate existing tables to remove incompatible vectors
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE vector_store CASCADE;

-- Drop and recreate the embedding column with 384 dimensions for ONNX MiniLM-L6-v2
ALTER TABLE vector_store DROP COLUMN embedding;
ALTER TABLE vector_store ADD COLUMN embedding vector(384);
