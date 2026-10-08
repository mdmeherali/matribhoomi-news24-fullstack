const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const COUNT_SELECT = `
    SELECT n.*,
        (SELECT COUNT(*) FROM reactions r WHERE r.news_id = n.id AND r.reaction = 'like') AS likes,
        (SELECT COUNT(*) FROM reactions r WHERE r.news_id = n.id AND r.reaction = 'dislike') AS dislikes,
        (SELECT COUNT(*) FROM comments c WHERE c.news_id = n.id) AS comment_count
    FROM news n
`;

router.get('/', async (req, res) => {
    const { category } = req.query;
    try {
        let query = COUNT_SELECT;
        let params = [];
        if (category && category !== 'সব') {
            query += 'WHERE n.category = ? ';
            params.push(category);
        }
        query += 'ORDER BY n.created_at DESC';
        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    const newsId = parseInt(req.params.id, 10);
    if (!Number.isInteger(newsId) || newsId <= 0) {
        return res.status(400).json({ error: 'Invalid news id' });
    }
    try {
        const [rows] = await db.query(COUNT_SELECT + 'WHERE n.id = ?', [newsId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', checkAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    const { title, content, category } = req.body;
    const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
    const videoUrl = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;
    try {
        await db.query('INSERT INTO news (title, content, category, image_url, video_url) VALUES (?, ?, ?, ?, ?)', [title, content, category, imageUrl, videoUrl]);
        res.status(201).json({ message: 'নিউজ সফলভাবে পোস্ট করা হয়েছে!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
