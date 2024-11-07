const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = { user_id: decoded.user_id, username: decoded.username, role: decoded.role };

            next();
        } catch (error) {
            res.status(401).send("Unauthorized access");
        }
    } else {
        res.status(401).send("Authorization header missing or invalid");
    }
}

function roleMiddleware(roles) {
    return (req, res, next) => {
        const user = req.user
        if (roles.includes(user.role)) {
            next()
        } else {
            res.status(403).json({ error: "Access Denied" })
        }
    }
}

module.exports = { authMiddleware, roleMiddleware }