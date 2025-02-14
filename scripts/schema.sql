DROP DATABASE IF EXISTS Ebook_backend;

CREATE DATABASE Ebook_backend;

-- Enable UUID extension (if needed for unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create 'orders' table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create 'users' table (Optional, if you want user authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
