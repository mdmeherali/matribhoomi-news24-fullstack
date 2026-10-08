const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|mkv|webm/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('ভুল ফাইল ফরম্যাট!'));
};

module.exports = multer({ storage, limits: { fileSize: 50*1024*1024 }, fileFilter });
