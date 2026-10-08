const express = require("express");
const router = express.Router();

const db = require("../config/db");


// ========================================
// VISITOR TRACKING
// ========================================

router.post("/visit", async (req, res) => {
    try {
        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress ||
            "unknown";

        const userAgent = req.headers["user-agent"] || "";

        // একই IP থেকে গত 30 মিনিটে visit থাকলে
        // নতুন visitor হিসেবে গণনা করবো না
        const [existing] = await db.query(
            `
            SELECT id
            FROM site_visits
            WHERE ip_address = ?
            AND visited_at >= NOW() - INTERVAL 30 MINUTE
            LIMIT 1
            `,
            [ip]
        );

        if (existing.length === 0) {
            await db.query(
                `
                INSERT INTO site_visits
                (ip_address, user_agent)
                VALUES (?, ?)
                `,
                [ip, userAgent]
            );
        }

        res.json({
            success: true
        });

    } catch (error) {

        console.error("Visitor tracking error:", error);

        res.status(500).json({
            success: false,
            message: "Visitor tracking failed"
        });
    }
});


// ========================================
// WEBSITE STATISTICS
// ========================================

router.get("/stats", async (req, res) => {

    try {

        // মোট visit
        const [totalVisits] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM site_visits
            `
        );


        // আজকের visit
        const [todayVisits] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM site_visits
            WHERE DATE(visited_at) = CURDATE()
            `
        );


        // Unique visitor
        const [uniqueVisitors] = await db.query(
            `
            SELECT COUNT(DISTINCT ip_address) AS total
            FROM site_visits
            `
        );


        // আজকের unique visitor
        const [todayUniqueVisitors] = await db.query(
            `
            SELECT COUNT(DISTINCT ip_address) AS total
            FROM site_visits
            WHERE DATE(visited_at) = CURDATE()
            `
        );


        // মোট subscriber
        const [subscriberCount] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM subscribers
            `
        );


        res.json({
            success: true,

            totalVisits: totalVisits[0].total,

            todayVisits: todayVisits[0].total,

            uniqueVisitors: uniqueVisitors[0].total,

            todayUniqueVisitors:
                todayUniqueVisitors[0].total,

            subscribers: subscriberCount[0].total
        });

    } catch (error) {

        console.error("Statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Statistics load failed"
        });
    }
});


// ========================================
// SUBSCRIBE
// ========================================

router.post("/subscribe", async (req, res) => {

    try {

        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();


        if (!email) {

            return res.status(400).json({
                success: false,
                message: "ইমেইল দিন"
            });
        }


        // Email format check
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({
                success: false,
                message: "সঠিক ইমেইল দিন"
            });
        }


        // আগে আছে কিনা
        const [existing] = await db.query(
            `
            SELECT id
            FROM subscribers
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );


        if (existing.length > 0) {

            return res.status(409).json({
                success: false,
                message: "এই ইমেইল ইতিমধ্যে Subscribe করা আছে"
            });
        }


        await db.query(
            `
            INSERT INTO subscribers (email)
            VALUES (?)
            `,
            [email]
        );


        res.status(201).json({

            success: true,

            message:
                "আপনি সফলভাবে Subscribe করেছেন"
        });

    } catch (error) {

        console.error("Subscribe error:", error);

        res.status(500).json({

            success: false,

            message:
                "Subscribe করতে সমস্যা হয়েছে"
        });
    }
});


// ========================================
// SUBSCRIBER LIST
// ========================================

router.get("/subscribers", async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                id,
                email,
                created_at
            FROM subscribers
            ORDER BY created_at DESC
            `
        );


        res.json({

            success: true,

            subscribers: rows
        });

    } catch (error) {

        console.error(
            "Subscriber list error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Subscriber list load failed"
        });
    }
});


module.exports = router;