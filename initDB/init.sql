-- Create roles table if it does not exist
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create users table if it does not exist
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role INT NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    count INT NOT NULL DEFAULT 0,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    password VARCHAR(500) NOT NULL,
    FOREIGN KEY (role) REFERENCES roles (role_id)
);

-- Insert initial roles if they do not exist
INSERT INTO roles (name)
SELECT 'admin'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

INSERT INTO roles (name)
SELECT 'client'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'client');

-- Insert 4 initial users
INSERT INTO users
    (email, name, role, password)
SELECT 'client1@example.com', 'Client 1', r.role_id, '$2a$10$qglLHvmy120Gd2RWiy3GPe1TPhCHLOl9kw/XbbixXHq23Kl9xeetS'
FROM roles r
WHERE r.name = 'client'
LIMIT 1;

INSERT INTO users
    (email, name, role, password)
SELECT 'client2@example.com', 'Client 2', r.role_id, '$2a$10$qglLHvmy120Gd2RWiy3GPe1TPhCHLOl9kw/XbbixXHq23Kl9xeetS'
FROM roles r
WHERE r.name = 'client'
LIMIT 1;

INSERT INTO users
    (email, name, role, password)
SELECT 'client3@example.com', 'Client 3', r.role_id, '$2a$10$qglLHvmy120Gd2RWiy3GPe1TPhCHLOl9kw/XbbixXHq23Kl9xeetS'
FROM roles r
WHERE r.name = 'client'
LIMIT 1;

INSERT INTO users
    (email, name, role, password)
SELECT 'admin@example.com', 'Admin User', r.role_id, '$2a$10$qglLHvmy120Gd2RWiy3GPe1TPhCHLOl9kw/XbbixXHq23Kl9xeetS'
FROM roles r
WHERE r.name = 'admin'
LIMIT 1;
