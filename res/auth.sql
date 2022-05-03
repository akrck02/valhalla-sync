CREATE TABLE IF NOT EXISTS 
auth (
    token TEXT, 
    username TEXT PRIMARY KEY, 
    password TEXT, 
    email TEXT
);

CREATE TABLE IF NOT EXISTS 
auth_device (
    device TEXT PRIMARY KEY,
    auth TEXT
);

