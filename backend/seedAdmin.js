require("dotenv").config();

const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function init() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const username = process.env.ADMIN_USERNAME;
        const rawPassword = process.env.ADMIN_PASSWORD;

        if (!username || !rawPassword) {
            throw new Error("ADMIN_USERNAME অথবা ADMIN_PASSWORD .env-এ নেই");
        }

        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        if (rows.length === 0) {
            await db.query(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                [username, hashedPassword, "admin"]
            );

            console.log("✅ Admin account তৈরি হয়েছে");
        } else {
            await db.query(
                "UPDATE users SET password = ?, role = ? WHERE username = ?",
                [hashedPassword, "admin", username]
            );

            console.log("✅ Admin password আপডেট হয়েছে");
        }

        process.exit(0);

    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
}

init();