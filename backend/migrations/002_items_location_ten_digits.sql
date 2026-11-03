-- Run before deploying the updated application against an existing database.
-- Restore leading zeros lost by the previous integer column by padding to 10 digits.
BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM items WHERE location::text !~ '^[0-9]{1,10}$') THEN
        RAISE EXCEPTION 'Invalid existing locations: correct them before running this migration';
    END IF;
END $$;

ALTER TABLE items
    ALTER COLUMN location TYPE VARCHAR(10)
    USING lpad(location::text, 10, '0');

ALTER TABLE items
    ADD CONSTRAINT ck_items_location_ten_digits
    CHECK (location ~ '^[0-9]{10}$');

COMMIT;
