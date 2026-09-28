TRUNCATE TABLE vector_store;
TRUNCATE TABLE documents RESTART IDENTITY CASCADE;
DROP INDEX IF EXISTS vector_store_embedding_idx;
ALTER TABLE vector_store ALTER COLUMN embedding TYPE vector(768);
CREATE INDEX ON vector_store USING HNSW (embedding vector_cosine_ops);
