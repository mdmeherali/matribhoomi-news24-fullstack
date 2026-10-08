const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret2026');
        req.userData = { userId: decodedToken.userId, username: decodedToken.username };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'অথরাইজেশন ব্যর্থ হয়েছে!' });
    }
};
