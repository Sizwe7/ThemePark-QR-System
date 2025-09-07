-- Theme Park QR Payment & Entrance System
-- Database Schema Creation Script
-- Version: 1.0
-- Author: SC MASEKO 402110470

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS themepark_qr_system;

-- Use the database
\c themepark_qr_system;

-- Create schemas for different modules
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS payment_system;
CREATE SCHEMA IF NOT EXISTS access_control;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS system_config;

-- Set search path to include all schemas
SET search_path TO user_management, payment_system, access_control, analytics, system_config, public;

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create custom types
CREATE TYPE user_role AS ENUM ('VISITOR', 'STAFF', 'MANAGER', 'ADMIN');
CREATE TYPE ticket_type AS ENUM ('SINGLE_DAY', 'MULTI_DAY', 'SEASON_PASS', 'VIP');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_WALLET', 'QR_PAYMENT');
CREATE TYPE entry_status AS ENUM ('VALID', 'EXPIRED', 'USED', 'BLOCKED');
CREATE TYPE attraction_status AS ENUM ('OPEN', 'CLOSED', 'MAINTENANCE', 'FULL_CAPACITY');

-- User Management Schema Tables
CREATE TABLE user_management.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    role user_role DEFAULT 'VISITOR',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image_url VARCHAR(500),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20)
);

CREATE TABLE user_management.user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id) ON DELETE CASCADE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_management.user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id) ON DELETE CASCADE,
    language_preference VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    accessibility_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"data_sharing": false, "analytics": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Access Control Schema Tables
CREATE TABLE access_control.tickets (
    ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    ticket_type ticket_type NOT NULL,
    qr_code_data TEXT UNIQUE NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    entry_status entry_status DEFAULT 'VALID',
    max_entries INTEGER DEFAULT 1,
    current_entries INTEGER DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(5,2) DEFAULT 0.00,
    special_access_permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_control.entry_logs (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES access_control.tickets(ticket_id),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    entry_point VARCHAR(100) NOT NULL,
    entry_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_timestamp TIMESTAMP WITH TIME ZONE,
    staff_id UUID REFERENCES user_management.users(user_id),
    verification_method VARCHAR(50) DEFAULT 'QR_SCAN',
    device_info JSONB,
    location_coordinates POINT,
    is_valid_entry BOOLEAN DEFAULT TRUE,
    notes TEXT
);

CREATE TABLE access_control.attractions (
    attraction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    max_capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    status attraction_status DEFAULT 'OPEN',
    minimum_age INTEGER DEFAULT 0,
    height_requirement INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    location_coordinates POINT,
    operating_hours JSONB,
    maintenance_schedule JSONB,
    safety_requirements TEXT,
    accessibility_features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_control.attraction_queue (
    queue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID NOT NULL REFERENCES access_control.attractions(attraction_id),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    ticket_id UUID NOT NULL REFERENCES access_control.tickets(ticket_id),
    queue_position INTEGER NOT NULL,
    estimated_wait_time INTEGER,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    served_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'WAITING',
    priority_level INTEGER DEFAULT 1,
    special_assistance_required BOOLEAN DEFAULT FALSE
);

-- Payment System Schema Tables
CREATE TABLE payment_system.payment_methods (
    payment_method_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    method_type payment_method NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    expiry_month INTEGER,
    expiry_year INTEGER,
    billing_address JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_system.transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    payment_method_id UUID REFERENCES payment_system.payment_methods(payment_method_id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL,
    status payment_status DEFAULT 'PENDING',
    description TEXT,
    merchant_reference VARCHAR(100),
    gateway_transaction_id VARCHAR(100),
    gateway_response JSONB,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_reason TEXT
);

CREATE TABLE payment_system.purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_management.users(user_id),
    transaction_id UUID NOT NULL REFERENCES payment_system.transactions(transaction_id),
    item_type VARCHAR(50) NOT NULL,
    item_id UUID,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(5,2) DEFAULT 0.00,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    purchase_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Schema Tables
CREATE TABLE analytics.visitor_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_management.users(user_id),
    session_id UUID,
    visit_date DATE NOT NULL,
    entry_time TIMESTAMP WITH TIME ZONE,
    exit_time TIMESTAMP WITH TIME ZONE,
    total_duration_minutes INTEGER,
    attractions_visited INTEGER DEFAULT 0,
    total_spending DECIMAL(10,2) DEFAULT 0.00,
    queue_time_minutes INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    feedback_comments TEXT,
    device_type VARCHAR(50),
    app_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.operational_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL,
    metric_hour INTEGER CHECK (metric_hour >= 0 AND metric_hour <= 23),
    total_visitors INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    average_wait_time INTEGER DEFAULT 0,
    peak_capacity_percentage DECIMAL(5,2) DEFAULT 0.00,
    staff_efficiency_score DECIMAL(5,2) DEFAULT 0.00,
    system_uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    error_count INTEGER DEFAULT 0,
    customer_satisfaction_avg DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.real_time_stats (
    stat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_visitors INTEGER DEFAULT 0,
    active_queues INTEGER DEFAULT 0,
    average_queue_time INTEGER DEFAULT 0,
    system_load_percentage DECIMAL(5,2) DEFAULT 0.00,
    payment_success_rate DECIMAL(5,2) DEFAULT 100.00,
    api_response_time_ms INTEGER DEFAULT 0,
    cache_hit_rate DECIMAL(5,2) DEFAULT 0.00,
    concurrent_users INTEGER DEFAULT 0
);

-- System Configuration Schema Tables
CREATE TABLE system_config.application_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'STRING',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES user_management.users(user_id)
);

CREATE TABLE system_config.audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_management.users(user_id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) DEFAULT 'INFO'
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_email ON user_management.users(email);
CREATE INDEX idx_users_role ON user_management.users(role);
CREATE INDEX idx_users_created_at ON user_management.users(created_at);

CREATE INDEX idx_tickets_user_id ON access_control.tickets(user_id);
CREATE INDEX idx_tickets_qr_code ON access_control.tickets(qr_code_data);
CREATE INDEX idx_tickets_valid_dates ON access_control.tickets(valid_from, valid_until);
CREATE INDEX idx_tickets_status ON access_control.tickets(entry_status);

CREATE INDEX idx_entry_logs_ticket_id ON access_control.entry_logs(ticket_id);
CREATE INDEX idx_entry_logs_timestamp ON access_control.entry_logs(entry_timestamp);
CREATE INDEX idx_entry_logs_entry_point ON access_control.entry_logs(entry_point);

CREATE INDEX idx_attractions_status ON access_control.attractions(status);
CREATE INDEX idx_attractions_category ON access_control.attractions(category);

CREATE INDEX idx_queue_attraction_id ON access_control.attraction_queue(attraction_id);
CREATE INDEX idx_queue_user_id ON access_control.attraction_queue(user_id);
CREATE INDEX idx_queue_status ON access_control.attraction_queue(status);

CREATE INDEX idx_transactions_user_id ON payment_system.transactions(user_id);
CREATE INDEX idx_transactions_status ON payment_system.transactions(status);
CREATE INDEX idx_transactions_created_at ON payment_system.transactions(created_at);

CREATE INDEX idx_purchases_user_id ON payment_system.purchases(user_id);
CREATE INDEX idx_purchases_transaction_id ON payment_system.purchases(transaction_id);

CREATE INDEX idx_visitor_analytics_date ON analytics.visitor_analytics(visit_date);
CREATE INDEX idx_visitor_analytics_user_id ON analytics.visitor_analytics(user_id);

CREATE INDEX idx_operational_metrics_date ON analytics.operational_metrics(metric_date);
CREATE INDEX idx_real_time_stats_timestamp ON analytics.real_time_stats(timestamp);

CREATE INDEX idx_audit_logs_user_id ON system_config.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON system_config.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON system_config.audit_logs(action);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON user_management.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON access_control.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attractions_updated_at BEFORE UPDATE ON access_control.attractions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_system.payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON system_config.application_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_config.application_settings (setting_key, setting_value, setting_type, description) VALUES
('max_daily_visitors', '10000', 'INTEGER', 'Maximum number of visitors allowed per day'),
('ticket_validity_days', '1', 'INTEGER', 'Default ticket validity period in days'),
('qr_code_expiry_minutes', '30', 'INTEGER', 'QR code expiry time in minutes'),
('payment_timeout_seconds', '300', 'INTEGER', 'Payment processing timeout in seconds'),
('queue_refresh_interval', '30', 'INTEGER', 'Queue status refresh interval in seconds'),
('maintenance_mode', 'false', 'BOOLEAN', 'System maintenance mode flag'),
('api_rate_limit', '1000', 'INTEGER', 'API requests per hour per user'),
('session_timeout_minutes', '120', 'INTEGER', 'User session timeout in minutes'),
('backup_retention_days', '30', 'INTEGER', 'Database backup retention period'),
('log_retention_days', '90', 'INTEGER', 'Audit log retention period');

-- Create views for common queries
CREATE VIEW analytics.daily_visitor_summary AS
SELECT 
    visit_date,
    COUNT(DISTINCT user_id) as unique_visitors,
    COUNT(*) as total_visits,
    AVG(total_duration_minutes) as avg_visit_duration,
    SUM(total_spending) as total_revenue,
    AVG(satisfaction_rating) as avg_satisfaction
FROM analytics.visitor_analytics
WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY visit_date
ORDER BY visit_date DESC;

CREATE VIEW access_control.current_queue_status AS
SELECT 
    a.name as attraction_name,
    a.max_capacity,
    a.current_occupancy,
    COUNT(aq.queue_id) as queue_length,
    AVG(aq.estimated_wait_time) as avg_wait_time,
    a.status
FROM access_control.attractions a
LEFT JOIN access_control.attraction_queue aq ON a.attraction_id = aq.attraction_id 
    AND aq.status = 'WAITING'
GROUP BY a.attraction_id, a.name, a.max_capacity, a.current_occupancy, a.status
ORDER BY queue_length DESC;

-- Grant permissions (adjust as needed for your security requirements)
-- Note: In production, create specific roles with limited permissions
GRANT USAGE ON SCHEMA user_management TO PUBLIC;
GRANT USAGE ON SCHEMA payment_system TO PUBLIC;
GRANT USAGE ON SCHEMA access_control TO PUBLIC;
GRANT USAGE ON SCHEMA analytics TO PUBLIC;
GRANT USAGE ON SCHEMA system_config TO PUBLIC;

-- Comment on tables for documentation
COMMENT ON TABLE user_management.users IS 'Core user information for visitors, staff, and administrators';
COMMENT ON TABLE access_control.tickets IS 'Digital tickets with QR codes for park entry and attractions';
COMMENT ON TABLE payment_system.transactions IS 'All financial transactions within the park system';
COMMENT ON TABLE analytics.visitor_analytics IS 'Visitor behavior and experience analytics data';
COMMENT ON TABLE system_config.audit_logs IS 'System audit trail for security and compliance';

-- Database schema creation completed successfully
SELECT 'Theme Park QR System database schema created successfully!' as status;

