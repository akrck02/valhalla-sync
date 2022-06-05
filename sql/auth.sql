CREATE TABLE IF NOT EXISTS 
auth (
    username TEXT PRIMARY KEY, 
    password TEXT, 
    email TEXT
);

CREATE TABLE IF NOT EXISTS 
auth_device (
    auth TEXT,
    platform TEXT,
    address TEXT,
    token TEXT, 
    PRIMARY KEY(auth, platform, address),
    FOREIGN KEY(auth) REFERENCES auth(username)
    
);

CREATE TABLE IF NOT EXISTS 
sync_registry (
    auth TEXT PRIMARY KEY,
    date TEXT,
    FOREIGN KEY(auth) REFERENCES auth(username)
);