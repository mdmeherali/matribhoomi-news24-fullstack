require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const db = require("./config/db");

const newsRoutes = require("./routes/newsRoutes");
const authRoutes = require("./routes/authRoutes");
const statsRoutes = require("./routes/statsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const interactionRoutes = require("./routes/interactionRoutes");


const app = express();


// ========================================
// RATE LIMIT (শুধু API রুটের জন্য)
// ========================================

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false
});


// ========================================
// SECURITY
// ========================================

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);


// ========================================
// CORS
// ========================================

app.use(
    cors({
        origin: "*"
    })
);


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());


// ========================================
// PUBLIC FOLDER
// ========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ========================================
// UPLOAD FOLDER
// ========================================

if (!fs.existsSync("./uploads")) {

    fs.mkdirSync("./uploads");
}


app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ========================================
// AUTO MIGRATION
// comments + reactions টেবিল না থাকলে
// সার্ভার চালু হওয়ার সময়ই তৈরি করে নেবে
// ========================================

async function ensureInteractionTables() {

    await db.query(
        `
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            news_id INT NOT NULL,
            username VARCHAR(50) NOT NULL,
            comment_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comments_news (news_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `
    );

    await db.query(
        `
        CREATE TABLE IF NOT EXISTS reactions (
            news_id INT NOT NULL,
            ip VARCHAR(64) NOT NULL,
            reaction ENUM('like', 'dislike') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (news_id, ip)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `
    );
}

ensureInteractionTables().catch((err) => {

    console.error(
        "Interaction table migration failed:",
        err.message
    );
});


// ========================================
// RATE LIMIT APPLY (API রুটে)
// ========================================

app.use("/api", limiter);


// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/news",
    newsRoutes
);


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/stats",
    statsRoutes
);


app.use(
    "/api/comments",
    commentRoutes
);


app.use(
    "/api/react",
    interactionRoutes
);


// ========================================
// 404
// ========================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Server error"
    });
});


// ========================================
// PORT
// ========================================

const PORT =
    process.env.PORT || 5001;


app.listen(PORT, () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});
