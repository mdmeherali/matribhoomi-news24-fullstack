const express = require("express");
const router = express.Router();

const db = require("../config/db");


// ========================================
// LIKE / DISLIKE TOGGLE
// একই IP আবার একই বাটন চাপলে বাতিল হবে,
// উল্টো বাটন চাপলে বদলে যাবে
// ========================================

router.post("/", async (req, res) => {

    try {

        const { news_id, type } = req.body || {};

        const newsId = parseInt(news_id, 10);


        if (
            !Number.isInteger(newsId) ||
            newsId <= 0
        ) {

            return res.status(400).json({
                message: "Invalid news id"
            });
        }


        if (
            type !== "like" &&
            type !== "dislike"
        ) {

            return res.status(400).json({
                message: "Type must be 'like' or 'dislike'"
            });
        }


        const ip =
            req.headers["x-forwarded-for"]
                ?.split(",")[0]
                ?.trim() ||
            req.socket.remoteAddress ||
            "unknown";


        const [existing] = await db.query(

            `
            SELECT reaction
            FROM reactions
            WHERE news_id = ?
            AND ip = ?
            `,
            [newsId, ip]
        );


        let userReaction = null;


        if (existing.length > 0) {

            const current = existing[0].reaction;

            if (current === type) {

                // আবার একই বাটন → বাতিল
                await db.query(

                    `
                    DELETE FROM reactions
                    WHERE news_id = ?
                    AND ip = ?
                    `,
                    [newsId, ip]
                );

                userReaction = null;

            } else {

                // উল্টো বাটন → বদলে দাও
                await db.query(

                    `
                    UPDATE reactions
                    SET reaction = ?
                    WHERE news_id = ?
                    AND ip = ?
                    `,
                    [type, newsId, ip]
                );

                userReaction = type;
            }

        } else {

            // নতুন রিঅ্যাকশন
            await db.query(

                `
                INSERT INTO reactions
                (news_id, ip, reaction)
                VALUES (?, ?, ?)
                `,
                [newsId, ip, type]
            );

            userReaction = type;
        }


        // নতুন কাউন্ট বের করে পাঠাও
        const [likeRows] = await db.query(

            `
            SELECT COUNT(*) AS total
            FROM reactions
            WHERE news_id = ?
            AND reaction = 'like'
            `,
            [newsId]
        );


        const [dislikeRows] = await db.query(

            `
            SELECT COUNT(*) AS total
            FROM reactions
            WHERE news_id = ?
            AND reaction = 'dislike'
            `,
            [newsId]
        );


        res.status(200).json({

            likes: likeRows[0].total,

            dislikes: dislikeRows[0].total,

            userReaction
        });


    } catch (err) {

        console.error("Reaction error:", err);

        res.status(500).json({
            message: "Reaction failed"
        });
    }
});


module.exports = router;
