CREATE TABLE IF NOT EXISTS 
auth (
    token TEXT PRIMARY KEY, 
    username TEXT, 
    password TEXT, 
    email TEXT
);

CREATE TABLE IF NOT EXISTS 
auth_device (
    device TEXT PRIMARY KEY,
    auth TEXT
);

