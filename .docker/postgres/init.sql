-- PostgreSQL initialization script
-- Creates test database for E2E tests

-- Create test database
CREATE DATABASE test_database;

-- Grant all privileges to postgres user on test database
GRANT ALL PRIVILEGES ON DATABASE test_database TO postgres;