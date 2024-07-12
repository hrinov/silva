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
    role_id INT NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    count INT NOT NULL DEFAULT 0,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    password VARCHAR(500) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

-- Insert initial roles if they do not exist
INSERT INTO roles (name)
SELECT 'admin'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

INSERT INTO roles (name)
SELECT 'client'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'client');

