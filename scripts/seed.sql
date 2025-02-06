-- Insert a test user
INSERT INTO users (email, password)
VALUES ('test@example.com', 'hashedpassword123')
ON CONFLICT (email) DO NOTHING;

-- Insert a test order
INSERT INTO orders (email, session_id, amount, status)
VALUES ('test@example.com', 'test-session-123', 999, 'paid')
ON CONFLICT (session_id) DO NOTHING;
