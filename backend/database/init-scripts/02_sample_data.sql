-- =====================================================================================
-- Theme Park QR Payment & Entrance System
-- Sample Data Insertion Script
-- Version: 1.2
-- Authors: SC MASEKO (402110470) and SF MHLABA (402312369)
-- =====================================================================================

-------------------------------------------------------------------------------------
-- IMPORTANT:
-- 1. Execute this script against the database "themepark_qr_system".
--    Ensure the database exists and has been initialized using the schema creation script (01_init_schema.sql).
--
-- 2. If the database does not exist, create it first:
--        CREATE DATABASE themepark_qr_system;
-------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------
-- INSTRUCTIONS:
-- 1. Running in pgAdmin (recommended):
--    • Open pgAdmin and connect to "themepark_qr_system".
--    • Open a new Query Tool session.
--    • Paste this script (02_sample_data.sql) into the editor.
--    • Run the script using the lightning bolt button.
--
-- 2. Running from terminal:
--    • Mac / Linux:
--        psql -U postgres -d themepark_qr_system -f /full/path/to/02_sample_data.sql
--    • Windows (PowerShell / CMD):
--        psql -U postgres -d themepark_qr_system -f "C:\full\path\to\02_sample_data.sql"
--
--    Notes:
--      • Replace `/full/path/to/02_sample_data.sql` or `"C:\full\path\to\02_sample_data.sql"` with the actual file location.
--      • Ensure the `psql` command is available (installed with PostgreSQL).
-------------------------------------------------------------------------------------

-- =====================================================================================
-- IntelliJ / DataGrip SQL Resolution Notes
-- =====================================================================================
-- NOTE:
-- 1. IntelliJ may highlight `user_management.users` and the functions crypt() / gen_salt() in red.
-- 2. These red underlines are **IDE-only inspection issues** and do NOT affect PostgreSQL execution.
-- 3. Resolution applied:
--      • SQL Resolution Scope set to the connected database "themepark_qr_system".
--      • Ensures IntelliJ recognizes tables in custom schemas and functions from pgcrypto.
-- 4. Ensure the pgcrypto extension is enabled in the database:
--        CREATE EXTENSION IF NOT EXISTS pgcrypto;
-------------------------------------------------------------------------------------

-- =========================================
-- Configure search path
-- =========================================
-- NOTE: Repeated from schema script to ensure correct schema resolution.
SET search_path TO user_management, payment_system, access_control, analytics, system_config, public;

-- =========================================
-- Insert sample user accounts
-- =========================================
INSERT INTO user_management.users (
    user_id, email, password_hash, first_name, last_name, phone_number, date_of_birth, role, email_verified
) VALUES
      -- Administrative users
      ('550e8400-e29b-41d4-a716-446655440001', 'admin@themepark.com', crypt('admin123', gen_salt('bf')), 'System', 'Administrator', '+1234567890', '1980-01-01', 'ADMIN', true),
      ('550e8400-e29b-41d4-a716-446655440002', 'manager@themepark.com', crypt('manager123', gen_salt('bf')), 'Park', 'Manager', '+1234567891', '1985-05-15', 'MANAGER', true),

      -- Staff users
      ('550e8400-e29b-41d4-a716-446655440003', 'staff1@themepark.com', crypt('staff123', gen_salt('bf')), 'John', 'Smith', '+1234567892', '1990-03-20', 'STAFF', true),
      ('550e8400-e29b-41d4-a716-446655440004', 'staff2@themepark.com', crypt('staff123', gen_salt('bf')), 'Sarah', 'Johnson', '+1234567893', '1988-07-10', 'STAFF', true),

      -- Visitor users
      ('550e8400-e29b-41d4-a716-446655440005', 'visitor1@email.com', crypt('visitor123', gen_salt('bf')), 'Alice', 'Brown', '+1234567894', '1995-12-05', 'VISITOR', true),
      ('550e8400-e29b-41d4-a716-446655440006', 'visitor2@email.com', crypt('visitor123', gen_salt('bf')), 'Bob', 'Wilson', '+1234567895', '1992-09-18', 'VISITOR', true),
      ('550e8400-e29b-41d4-a716-446655440007', 'visitor3@email.com', crypt('visitor123', gen_salt('bf')), 'Carol', 'Davis', '+1234567896', '1987-04-22', 'VISITOR', true),
      ('550e8400-e29b-41d4-a716-446655440008', 'visitor4@email.com', crypt('visitor123', gen_salt('bf')), 'David', 'Miller', '+1234567897', '1993-11-30', 'VISITOR', true),
      ('550e8400-e29b-41d4-a716-446655440009', 'visitor5@email.com', crypt('visitor123', gen_salt('bf')), 'Emma', 'Garcia', '+1234567898', '1996-02-14', 'VISITOR', true),
      ('550e8400-e29b-41d4-a716-446655440010', 'visitor6@email.com', crypt('visitor123', gen_salt('bf')), 'Frank', 'Rodriguez', '+1234567899', '1989-08-07', 'VISITOR', true);

-- =========================================
-- Confirmation message
-- =========================================
DO $$
    BEGIN
        RAISE NOTICE 'Sample data insertion completed successfully!';
    END$$;