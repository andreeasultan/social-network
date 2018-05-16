DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    bio VARCHAR(255)
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- STATUSES OF FRIEND REQUEST:
-- No request:0
-- Pending: 1
-- Aceepted:2
-- Rejected: 3
-- Terminated:4
-- Cancelled: 5
