-- Theme Park QR Payment & Entrance System
-- Sample Data Insertion Script
-- Version: 1.0
-- Author: SC MASEKO 402110470

-- Connect to the database
\c themepark_qr_system;

-- Set search path
SET search_path TO user_management, payment_system, access_control, analytics, system_config, public;

-- Insert sample users
INSERT INTO user_management.users (user_id, email, password_hash, first_name, last_name, phone_number, date_of_birth, role, email_verified) VALUES
-- Admin users
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

-- Insert user preferences
INSERT INTO user_management.user_preferences (user_id, language_preference, notification_preferences, accessibility_settings, privacy_settings) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'en', '{"email": true, "push": true, "sms": false}', '{"large_text": false, "high_contrast": false}', '{"data_sharing": false, "analytics": true}'),
('550e8400-e29b-41d4-a716-446655440006', 'en', '{"email": true, "push": false, "sms": true}', '{"large_text": true, "high_contrast": false}', '{"data_sharing": true, "analytics": true}'),
('550e8400-e29b-41d4-a716-446655440007', 'es', '{"email": false, "push": true, "sms": false}', '{"large_text": false, "high_contrast": true}', '{"data_sharing": false, "analytics": false}'),
('550e8400-e29b-41d4-a716-446655440008', 'en', '{"email": true, "push": true, "sms": true}', '{"large_text": false, "high_contrast": false}', '{"data_sharing": true, "analytics": true}'),
('550e8400-e29b-41d4-a716-446655440009', 'fr', '{"email": true, "push": true, "sms": false}', '{"large_text": true, "high_contrast": true}', '{"data_sharing": false, "analytics": true}'),
('550e8400-e29b-41d4-a716-446655440010', 'en', '{"email": false, "push": false, "sms": false}', '{"large_text": false, "high_contrast": false}', '{"data_sharing": false, "analytics": false}');

-- Insert sample attractions
INSERT INTO access_control.attractions (attraction_id, name, description, category, max_capacity, status, minimum_age, height_requirement, duration_minutes, operating_hours, accessibility_features) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Thunder Mountain Coaster', 'High-speed roller coaster with thrilling drops and turns', 'Thrill Rides', 24, 'OPEN', 12, 140, 3, '{"open": "09:00", "close": "22:00"}', '{"wheelchair_accessible": false, "hearing_assistance": true}'),
('650e8400-e29b-41d4-a716-446655440002', 'Family Fun Carousel', 'Classic carousel ride suitable for all ages', 'Family Rides', 32, 'OPEN', 0, 0, 4, '{"open": "09:00", "close": "21:00"}', '{"wheelchair_accessible": true, "hearing_assistance": true}'),
('650e8400-e29b-41d4-a716-446655440003', 'Adventure Water Rapids', 'Exciting water ride through rapids and waterfalls', 'Water Rides', 16, 'OPEN', 8, 120, 6, '{"open": "10:00", "close": "20:00"}', '{"wheelchair_accessible": false, "hearing_assistance": false}'),
('650e8400-e29b-41d4-a716-446655440004', 'Sky High Ferris Wheel', 'Giant ferris wheel with panoramic park views', 'Scenic Rides', 48, 'OPEN', 0, 0, 12, '{"open": "09:00", "close": "23:00"}', '{"wheelchair_accessible": true, "hearing_assistance": true}'),
('650e8400-e29b-41d4-a716-446655440005', 'Haunted Mansion', 'Spooky dark ride through a haunted house', 'Dark Rides', 20, 'OPEN', 10, 0, 8, '{"open": "11:00", "close": "22:00"}', '{"wheelchair_accessible": true, "hearing_assistance": false}'),
('650e8400-e29b-41d4-a716-446655440006', 'Bumper Cars Arena', 'Classic bumper car attraction for all ages', 'Family Rides', 16, 'OPEN', 6, 0, 5, '{"open": "09:00", "close": "21:00"}', '{"wheelchair_accessible": false, "hearing_assistance": true}'),
('650e8400-e29b-41d4-a716-446655440007', 'Space Mission Simulator', 'Virtual reality space exploration experience', 'VR Experiences', 12, 'MAINTENANCE', 8, 0, 15, '{"open": "10:00", "close": "20:00"}', '{"wheelchair_accessible": true, "hearing_assistance": true}'),
('650e8400-e29b-41d4-a716-446655440008', 'Pirate Ship Adventure', 'Swinging pirate ship with moderate thrills', 'Thrill Rides', 28, 'OPEN', 8, 110, 4, '{"open": "09:00", "close": "22:00"}', '{"wheelchair_accessible": false, "hearing_assistance": true}');

-- Insert sample tickets
INSERT INTO access_control.tickets (ticket_id, user_id, ticket_type, qr_code_data, valid_from, valid_until, price) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'SINGLE_DAY', 'QR_ALICE_BROWN_20250907_001', CURRENT_DATE, CURRENT_DATE, 89.99),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'SINGLE_DAY', 'QR_BOB_WILSON_20250907_002', CURRENT_DATE, CURRENT_DATE, 89.99),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'MULTI_DAY', 'QR_CAROL_DAVIS_20250907_003', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 159.99),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 'VIP', 'QR_DAVID_MILLER_20250907_004', CURRENT_DATE, CURRENT_DATE, 199.99),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'SINGLE_DAY', 'QR_EMMA_GARCIA_20250907_005', CURRENT_DATE, CURRENT_DATE, 89.99),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', 'SEASON_PASS', 'QR_FRANK_RODRIGUEZ_20250907_006', CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', 299.99);

-- Insert sample payment methods
INSERT INTO payment_system.payment_methods (user_id, method_type, card_last_four, card_brand, expiry_month, expiry_year, billing_address, is_default) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'CREDIT_CARD', '1234', 'Visa', 12, 2026, '{"street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345"}', true),
('550e8400-e29b-41d4-a716-446655440006', 'DEBIT_CARD', '5678', 'Mastercard', 8, 2025, '{"street": "456 Oak Ave", "city": "Somewhere", "state": "NY", "zip": "67890"}', true),
('550e8400-e29b-41d4-a716-446655440007', 'MOBILE_WALLET', NULL, 'Apple Pay', NULL, NULL, '{"street": "789 Pine Rd", "city": "Elsewhere", "state": "TX", "zip": "54321"}', true),
('550e8400-e29b-41d4-a716-446655440008', 'CREDIT_CARD', '9012', 'American Express', 3, 2027, '{"street": "321 Elm St", "city": "Nowhere", "state": "FL", "zip": "98765"}', true),
('550e8400-e29b-41d4-a716-446655440009', 'QR_PAYMENT', NULL, 'PayPal', NULL, NULL, '{"street": "654 Maple Dr", "city": "Anywhere", "state": "WA", "zip": "13579"}', true),
('550e8400-e29b-41d4-a716-446655440010', 'CREDIT_CARD', '3456', 'Visa', 6, 2026, '{"street": "987 Cedar Ln", "city": "Everywhere", "state": "OR", "zip": "24680"}', true);

-- Insert sample transactions
INSERT INTO payment_system.transactions (transaction_id, user_id, amount, transaction_type, status, description, gateway_transaction_id) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 89.99, 'TICKET_PURCHASE', 'COMPLETED', 'Single Day Ticket Purchase', 'GTW_001_20250907'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 89.99, 'TICKET_PURCHASE', 'COMPLETED', 'Single Day Ticket Purchase', 'GTW_002_20250907'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 159.99, 'TICKET_PURCHASE', 'COMPLETED', 'Multi-Day Ticket Purchase', 'GTW_003_20250907'),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 199.99, 'TICKET_PURCHASE', 'COMPLETED', 'VIP Ticket Purchase', 'GTW_004_20250907'),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 89.99, 'TICKET_PURCHASE', 'COMPLETED', 'Single Day Ticket Purchase', 'GTW_005_20250907'),
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', 299.99, 'TICKET_PURCHASE', 'COMPLETED', 'Season Pass Purchase', 'GTW_006_20250907'),
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 15.50, 'FOOD_PURCHASE', 'COMPLETED', 'Lunch at Main Street Cafe', 'GTW_007_20250907'),
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', 25.00, 'MERCHANDISE', 'COMPLETED', 'Theme Park T-Shirt', 'GTW_008_20250907'),
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', 8.75, 'FOOD_PURCHASE', 'COMPLETED', 'Ice Cream and Drinks', 'GTW_009_20250907');

-- Insert sample purchases
INSERT INTO payment_system.purchases (user_id, transaction_id, item_type, item_id, quantity, unit_price, total_price) VALUES
('550e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440001', 'TICKET', '750e8400-e29b-41d4-a716-446655440001', 1, 89.99, 89.99),
('550e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440002', 'TICKET', '750e8400-e29b-41d4-a716-446655440002', 1, 89.99, 89.99),
('550e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440003', 'TICKET', '750e8400-e29b-41d4-a716-446655440003', 1, 159.99, 159.99),
('550e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440004', 'TICKET', '750e8400-e29b-41d4-a716-446655440004', 1, 199.99, 199.99),
('550e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440005', 'TICKET', '750e8400-e29b-41d4-a716-446655440005', 1, 89.99, 89.99),
('550e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440006', 'TICKET', '750e8400-e29b-41d4-a716-446655440006', 1, 299.99, 299.99),
('550e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440007', 'FOOD', NULL, 1, 15.50, 15.50),
('550e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440008', 'MERCHANDISE', NULL, 1, 25.00, 25.00),
('550e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440009', 'FOOD', NULL, 2, 4.375, 8.75);

-- Insert sample entry logs
INSERT INTO access_control.entry_logs (ticket_id, user_id, entry_point, staff_id, verification_method, is_valid_entry) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Main Entrance Gate 1', '550e8400-e29b-41d4-a716-446655440003', 'QR_SCAN', true),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'Main Entrance Gate 2', '550e8400-e29b-41d4-a716-446655440004', 'QR_SCAN', true),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'VIP Entrance', '550e8400-e29b-41d4-a716-446655440003', 'QR_SCAN', true),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 'VIP Entrance', '550e8400-e29b-41d4-a716-446655440004', 'QR_SCAN', true),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'Main Entrance Gate 1', '550e8400-e29b-41d4-a716-446655440003', 'QR_SCAN', true),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', 'Season Pass Entrance', '550e8400-e29b-41d4-a716-446655440004', 'QR_SCAN', true);

-- Insert sample queue data
INSERT INTO access_control.attraction_queue (attraction_id, user_id, ticket_id, queue_position, estimated_wait_time, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', 1, 15, 'WAITING'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440002', 2, 20, 'WAITING'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', 1, 5, 'WAITING'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', 1, 8, 'WAITING'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440005', 1, 12, 'WAITING');

-- Insert sample visitor analytics
INSERT INTO analytics.visitor_analytics (user_id, visit_date, entry_time, total_duration_minutes, attractions_visited, total_spending, satisfaction_rating, feedback_comments) VALUES
('550e8400-e29b-41d4-a716-446655440005', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '4 hours', 240, 5, 105.49, 5, 'Amazing experience! The QR system made everything so smooth.'),
('550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '3 hours', 180, 3, 114.99, 4, 'Great day at the park. Loved the new mobile payment system.'),
('550e8400-e29b-41d4-a716-446655440007', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '5 hours', 300, 6, 168.74, 5, 'Multi-day pass is excellent value. Very convenient QR entry.'),
('550e8400-e29b-41d4-a716-446655440008', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '6 hours', 360, 8, 199.99, 5, 'VIP experience was worth every penny. No waiting in lines!'),
('550e8400-e29b-41d4-a716-446655440009', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', 120, 2, 89.99, 4, 'Good experience overall. The app could use some improvements.');

-- Insert sample operational metrics
INSERT INTO analytics.operational_metrics (metric_date, metric_hour, total_visitors, total_revenue, average_wait_time, peak_capacity_percentage, customer_satisfaction_avg) VALUES
(CURRENT_DATE, 9, 150, 13499.25, 8, 45.5, 4.2),
(CURRENT_DATE, 10, 280, 25199.50, 12, 67.8, 4.3),
(CURRENT_DATE, 11, 420, 37899.75, 15, 85.2, 4.1),
(CURRENT_DATE, 12, 580, 52199.00, 18, 92.5, 4.0),
(CURRENT_DATE, 13, 650, 58499.25, 22, 98.7, 3.9),
(CURRENT_DATE, 14, 720, 64799.50, 25, 95.3, 4.1),
(CURRENT_DATE, 15, 680, 61199.75, 20, 89.6, 4.2),
(CURRENT_DATE, 16, 590, 53099.00, 16, 78.4, 4.4),
(CURRENT_DATE, 17, 450, 40499.25, 12, 65.7, 4.5);

-- Insert sample real-time stats
INSERT INTO analytics.real_time_stats (current_visitors, active_queues, average_queue_time, system_load_percentage, payment_success_rate, api_response_time_ms, concurrent_users) VALUES
(342, 8, 16, 68.5, 99.2, 145, 89),
(298, 6, 12, 62.3, 99.5, 132, 76),
(415, 10, 19, 75.8, 98.9, 167, 103),
(267, 5, 8, 55.2, 99.8, 118, 64),
(389, 9, 14, 71.6, 99.3, 156, 95);

-- Insert sample audit logs
INSERT INTO system_config.audit_logs (user_id, action, table_name, record_id, ip_address, severity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'USER_LOGIN', 'users', '550e8400-e29b-41d4-a716-446655440001', '192.168.1.100', 'INFO'),
('550e8400-e29b-41d4-a716-446655440002', 'TICKET_CREATED', 'tickets', '750e8400-e29b-41d4-a716-446655440001', '192.168.1.101', 'INFO'),
('550e8400-e29b-41d4-a716-446655440003', 'ENTRY_VALIDATED', 'entry_logs', '750e8400-e29b-41d4-a716-446655440001', '192.168.1.102', 'INFO'),
('550e8400-e29b-41d4-a716-446655440001', 'SYSTEM_SETTING_CHANGED', 'application_settings', NULL, '192.168.1.100', 'WARN'),
('550e8400-e29b-41d4-a716-446655440004', 'PAYMENT_PROCESSED', 'transactions', '850e8400-e29b-41d4-a716-446655440001', '192.168.1.103', 'INFO');

-- Update attraction current occupancy for realistic data
UPDATE access_control.attractions SET current_occupancy = 
    CASE 
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440001' THEN 18
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440002' THEN 25
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440003' THEN 12
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440004' THEN 35
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440005' THEN 15
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440006' THEN 8
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440007' THEN 0
        WHEN attraction_id = '650e8400-e29b-41d4-a716-446655440008' THEN 22
        ELSE current_occupancy
    END;

-- Create some user sessions for active users
INSERT INTO user_management.user_sessions (user_id, device_info, ip_address, user_agent, expires_at) VALUES
('550e8400-e29b-41d4-a716-446655440005', '{"device": "iPhone 14", "os": "iOS 16.5", "app_version": "1.0.0"}', '192.168.1.105', 'ThemeParkApp/1.0.0 (iOS)', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440006', '{"device": "Samsung Galaxy S23", "os": "Android 13", "app_version": "1.0.0"}', '192.168.1.106', 'ThemeParkApp/1.0.0 (Android)', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440007', '{"device": "iPad Pro", "os": "iPadOS 16.5", "app_version": "1.0.0"}', '192.168.1.107', 'ThemeParkApp/1.0.0 (iOS)', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', '{"device": "Windows PC", "os": "Windows 11", "browser": "Chrome 116"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP + INTERVAL '8 hours'),
('550e8400-e29b-41d4-a716-446655440002', '{"device": "MacBook Pro", "os": "macOS 13.5", "browser": "Safari 16.5"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', CURRENT_TIMESTAMP + INTERVAL '8 hours');

-- Verify data insertion
SELECT 'Sample data insertion completed successfully!' as status;

-- Display summary statistics
SELECT 
    'Users' as table_name, 
    COUNT(*) as record_count,
    COUNT(CASE WHEN role = 'VISITOR' THEN 1 END) as visitors,
    COUNT(CASE WHEN role = 'STAFF' THEN 1 END) as staff,
    COUNT(CASE WHEN role = 'MANAGER' THEN 1 END) as managers,
    COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admins
FROM user_management.users

UNION ALL

SELECT 
    'Tickets' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN ticket_type = 'SINGLE_DAY' THEN 1 END) as single_day,
    COUNT(CASE WHEN ticket_type = 'MULTI_DAY' THEN 1 END) as multi_day,
    COUNT(CASE WHEN ticket_type = 'VIP' THEN 1 END) as vip,
    COUNT(CASE WHEN ticket_type = 'SEASON_PASS' THEN 1 END) as season_pass
FROM access_control.tickets

UNION ALL

SELECT 
    'Attractions' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open,
    COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) as closed,
    COUNT(CASE WHEN status = 'MAINTENANCE' THEN 1 END) as maintenance,
    COUNT(CASE WHEN status = 'FULL_CAPACITY' THEN 1 END) as full_capacity
FROM access_control.attractions

UNION ALL

SELECT 
    'Transactions' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed,
    COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END) as refunded
FROM payment_system.transactions;

-- Display current queue status
SELECT * FROM access_control.current_queue_status;

-- Display today's visitor summary
SELECT * FROM analytics.daily_visitor_summary WHERE visit_date = CURRENT_DATE;

