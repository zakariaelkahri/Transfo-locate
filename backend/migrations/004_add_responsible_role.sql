-- SQLAlchemy stores RoleEnum member names in PostgreSQL, not their values.
-- Apply before creating responsible accounts on an existing database.
ALTER TYPE roleenum ADD VALUE IF NOT EXISTS 'RESP';
