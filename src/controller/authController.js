const db = require("../utils/connectDB");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config");

class authController {
    login = async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const sql = `SELECT * FROM users WHERE username = ?`
            const result = await db.query(sql, [username]);

            if (result[0].length === 0) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            const user = result[0][0];

            const isMatch = await bcrypt.compare(atob(password), user.password);

            if (isMatch) {
                const token = jwt.sign(
                    { user_id: user.id, username: user.username, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                const decoded = jwt.verify(token, JWT_SECRET)

                res.json({ token: token, user_id: user.id, username: user.username, role: user.role, exp: decoded.exp });
            } else {
                res.status(400).json({ message: "Invalid Credentials" });
            }
        } catch (error) {
            res.status(500).json({ error: "Unable to login", message: error.message });
        }
    };


    register = async (req, res) => {
        try {
            const { username, password, role } = req.body

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(atob(password), salt)

            const sql = `INSERT INTO users (username, password, role) VALUES ('${username}', '${hashedPassword}', '${role}')`

            await db.query(sql)

            res.send("User created successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to register", message: error.message })
        }
    }
}

module.exports = authController