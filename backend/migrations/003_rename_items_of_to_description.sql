-- Apply to an existing database before deploying the updated application.
-- Renaming preserves existing values and the nullable VARCHAR(50) type.
ALTER TABLE items RENAME COLUMN "of" TO description;
