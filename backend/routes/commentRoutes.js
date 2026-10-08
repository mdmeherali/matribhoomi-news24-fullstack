const express = require("express");
const router = express.Router();

const db = require("../config/db");


const USERNAME_MAX = 50;
const COMMENT_MAX = 500;


// ========================================
// কমেন্ট লিস্ট আনা
// ========================================

router.get("/:newsId", async (req, res) => {

    try {

        const newsId = parseInt(req.params.newsId, 10);


        if (
            !Number.isInteger(newsId) ||
            newsId <= 0
        ) {

            return res.status(400).json({
                message: "Invalid news id"
            });
        }


        const [rows] = await db.query(

            `
            SELECT
                id,
                username,
                comment_text,
                created_at
            FROM comments
            WHERE news_id = ?
            ORDER BY created_at DESC, id DESC
            `,
            [newsId]
        );


        res.status(200).json(rows);


    } catch (err) {

        console.error("Comment list error:", err);

        res.status(500).json({
            message: "Comment list load failed"
        });
    }
});


// ========================================
// নতুন কমেন্ট পোস্ট
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            news_id,
            username,
            comment_text
        } = req.body || {};


        const newsId = parseInt(news_id, 10);

        const name = String(username ?? "").trim();

        const text = String(comment_text ?? "").trim();


        if (
            !Number.isInteger(newsId) ||
            newsId <= 0
        ) {

            return res.status(400).json({
                message: "Invalid news id"
            });
        }


        if (
            !name ||
            name.length > USERNAME_MAX
        ) {

            return res.status(400).json({
                message:
                    `নাম দিন (সর্বোচ্চ ${USERNAME_MAX} অক্ষর)`
            });
        }


        if (
            !text ||
            text.length > COMMENT_MAX
        ) {

            return res.status(400).json({
                message:
                    `কমেন্ট লিখুন (সর্বোচ্চ ${COMMENT_MAX} অক্ষর)`
            });
        }


        await db.query(

            `
            INSERT INTO comments
            (news_id, username, comment_text)
            VALUES (?, ?, ?)
            `,
            [newsId, name, text]
        );


        // আপডেটেড লিস্ট ফেরত পাঠাও
        const [rows] = await db.query(

            `
            SELECT
                id,
                username,
                comment_text,
                created_at
            FROM comments
            WHERE news_id = ?
            ORDER BY created_at DESC, id DESC
            `,
            [newsId]
        );


        res.status(201).json({

            message: "কমেন্ট সফলভাবে যোগ হয়েছে!",

            comments: rows
        });


    } catch (err) {

        console.error("Comment post error:", err);

        res.status(500).json({
            message: "কমেন্ট পোস্ট করতে সমস্যা হয়েছে"
        });
    }
});


module.exports = router;
