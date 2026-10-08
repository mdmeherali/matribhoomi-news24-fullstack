const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const checkAuth = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ message: 'ভুল ইউজারনেম বা পাসওয়ার্ড!' });
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) return res.status(401).json({ message: 'ভুল ইউজারনেম বা পাসওয়ার্ড!' });
        const token = jwt.sign({ userId: rows[0].id, username: rows[0].username }, process.env.JWT_SECRET || 'secret2026', { expiresIn: '2h' });
        res.status(200).json({ token, username: rows[0].username });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/change-password', checkAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userData.userId]);
        const match = await bcrypt.compare(oldPassword, rows[0].password);
        if (!match) return res.status(400).json({ message: 'পুরাতন পাসওয়ার্ডটি সঠিক নয়!' });
        const hash = await bcrypt.hash(newPassword, 12);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.userData.userId]);
        res.status(200).json({ message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
