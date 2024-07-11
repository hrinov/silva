-- Create roles table
CREATE TABLE roles
(
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles into roles table
INSERT INTO roles
    (role_name)
VALUES
    ('admin'),
    ('client');

-- Create users table
CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    count INT NOT NULL DEFAULT 0,
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

-- Insert admin user
INSERT INTO users
    (email, name, role_id, blocked, count)
VALUES
    ('admin@gmail.com', 'Admin', (SELECT role_id
        FROM roles
        WHERE role_name = 'admin'), false, 0);

-- Insert client users
INSERT INTO users
    (email, name, role_id, blocked, count)
VALUES
    ('client1@gmail.com', 'Client 1', (SELECT role_id
        FROM roles
        WHERE role_name = 'client'), false, 0);

INSERT INTO users
    (email, name, role_id, blocked, count)
VALUES
    ('client2@gmail.com', 'Client 2', (SELECT role_id
        FROM roles
        WHERE role_name = 'client'), false, 0);

INSERT INTO users
    (email, name, role_id, blocked, count)
VALUES
    ('client3@gmail.com', 'Client 3', (SELECT role_id
        FROM roles
        WHERE role_name = 'client'), false, 0);
