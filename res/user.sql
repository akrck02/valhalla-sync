CREATE TABLE IF NOT EXISTS 
user (
    username TEXT PRIMARY KEY,
    password TEXT,
    email TEXT,
    oauth TEXT,
    picture TEXT
);