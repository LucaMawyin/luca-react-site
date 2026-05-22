CREATE TABLE projects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    link TEXT,
    image BLOB,
    image_type TEXT,
    languages TEXT,
    tools TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO projects(
        name,
        description,
        link,
        languages,
        tools
    )
VALUES (
        "Tetris",
        "A web-based Tetris game with local user high-score saving",
        "https://lucamawyin.com/tetris/",
        '["JavaScript","HTML", "CSS"]',
        NULL
    ),
    (
        "Derivative Calculator",
        "A functional program that evaluates, derives, and simplifies functions",
        "https://github.com/LucaMawyin/CS1JC3/blob/master/Assignments/1JC3-Assign4/src/Assign_4.hs",
        '["Haskell"]',
        NULL
    ),
    (
        "Discussion Forum",
        "A full-stack student discussion forum, allowing for code sharing by formatting text using markup",
        "https://github.com/LucaMawyin/discussionForum",
        '["JavaScript","PHP","SQL","HTML","CSS"]',
        '["MySQL","Apache"]'
    ),
    (
        "Computer Vision",
        "Programs to track hand movements and detect various objects",
        "https://github.com/LucaMawyin/computerVision",
        '["Python"]',
        '["OpenCV","Mediapipe"]'
    ),
    (
        "Client Campaign Platform Site",
        "A student government campaign website for election campaign",
        "voteterry.org",
        '["JavaScript","HTML","CSS"]',
        '["Cloudflare Pages"]'
    ),
    (
        "Client Portfolio and Article Publishing Platform",
        "A full-stack media portfolio application that allows user to publish and manage articles",
        "https://nicholasfrangos.com",
        '["TypeScript","SQL","HTML","CSS"]',
        '["React","Next.js","Tailwind CSS","Cloudflare D1","Cloudflare Workers","Two-Factor Authentication","Resend","IPify","YouTube Data API"]'
    );
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    ip_address TEXT,
    geo TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);