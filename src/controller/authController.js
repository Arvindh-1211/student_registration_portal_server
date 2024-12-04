const { JWT_SECRET } = require("../config/config")
const {userTable} = require('../utils/connectCAMPS')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class authController {
    login = async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const sql = `SELECT * FROM registration_user WHERE username = ?`
            const result = await userTable.query(sql, [username]);

            if (result[0].length === 0) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            const user = result[0][0];

            const salt = user.pwdsalt;
            const hashedPassword = crypto.createHash('sha256');
            hashedPassword.update(salt + atob(password));
            const hashedPasswordHex = hashedPassword.digest('hex');

            if (hashedPasswordHex === user.password) {
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
            const { username, password } = req.body

            const salt = (Math.random() + 1).toString(36).substring(2)

            const sql = `INSERT INTO registration_user (username, password, pwdsalt) VALUES ('${username}', SHA256(CONCAT('${salt}', '${password}')), '${salt}');`

            await userTable.query(sql)

            res.send("User created successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to register", message: error.message })
        }
    }
}

module.exports = authController