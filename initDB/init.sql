-- Check if roles table exists before creating it
CREATE TABLE
IF NOT EXISTS roles
(
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR
(50) UNIQUE NOT NULL
);

-- Insert roles only if they don't exist
INSERT INTO roles
    (role_name)
SELECT 'admin'
WHERE NOT EXISTS (SELECT 1
FROM roles
WHERE role_name = 'admin');
INSERT INTO roles
    (role_name)
SELECT 'client'
WHERE NOT EXISTS (SELECT 1
FROM roles
WHERE role_name = 'client');

-- Create users table if it doesn't exist
CREATE TABLE
IF NOT EXISTS users
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR
(100) UNIQUE NOT NULL,
    name VARCHAR
(100) NOT NULL,
    role_id INT NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    count INT NOT NULL DEFAULT 0,
    FOREIGN KEY
(role_id) REFERENCES roles
(role_id)
);

-- Insert admin user if it doesn't exist
INSERT INTO users
    (email, name, role_id, blocked, count)
SELECT 'admin@gmail.com', 'Admin', r.role_id, false, 0
FROM roles r
WHERE r.role_name = 'admin' AND NOT EXISTS (SELECT 1
    FROM users
    WHERE email = 'admin@gmail.com');

-- Insert client users if they don't exist
INSERT INTO users
    (email, name, role_id, blocked, count)
SELECT 'client1@gmail.com', 'Client 1', r.role_id, false, 0
FROM roles r
WHERE r.role_name = 'client' AND NOT EXISTS (SELECT 1
    FROM users
    WHERE email = 'client1@gmail.com');

INSERT INTO users
    (email, name, role_id, blocked, count)
SELECT 'client2@gmail.com', 'Client 2', r.role_id, false, 0
FROM roles r
WHERE r.role_name = 'client' AND NOT EXISTS (SELECT 1
    FROM users
    WHERE email = 'client2@gmail.com');

INSERT INTO users
    (email, name, role_id, blocked, count)
SELECT 'client3@gmail.com', 'Client 3', r.role_id, false, 0
FROM roles r
WHERE r.role_name = 'client' AND NOT EXISTS (SELECT 1
    FROM users
    WHERE email = 'client3@gmail.com');