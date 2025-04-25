const { JWT_SECRET } = require("../config/config")
const { userTable } = require('../utils/connectCAMPS')
const jwt = require('jsonwebtoken')

class authController {
    login = async (req, res) => {
        try {
            const { username, password, loginType } = req.body;

            if (loginType === 'google') {
                const { email } = req.body

                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${email}'`;
                let result = await userTable.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                const user = result[0][0];

                const token = jwt.sign(
                    { user_id: user.id, username: user.username, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                const decoded = jwt.verify(token, JWT_SECRET)

                res.json({ token: token, user_id: user.id, username: user.username, role: user.role, exp: decoded.exp });
            }

            else if (loginType === 'application_number') {
                if (!username || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${username}'`
                let result = await userTable.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                const pwdsalt = result[0][0].pwdsalt

                // TODO Change table name, coloumn names
                sql = `SELECT * FROM registration_user WHERE username = '${username}' AND password = '${atob(password)}'`

                result = await userTable.query(sql);

                const user = result[0][0];

                if (user) {
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
            }

            else {

                if (!username || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${username}'`
                let result = await userTable.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                const pwdsalt = result[0][0].pwdsalt

                sql = `SELECT * FROM registration_user WHERE username = '${username}' AND password = SHA2(CONCAT('${atob(password)}', '${pwdsalt}'), 256)`

                result = await userTable.query(sql);

                const user = result[0][0];

                if (user) {
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
            }
        } catch (error) {
            res.status(500).json({ error: "Unable to login", message: error.message });
        }
    };


    // register = async (req, res) => {
    //     try {
    //         const { username, password } = req.body

    //         const salt = (Math.random() + 1).toString(36).substring(2)

    //         const sql = `INSERT INTO registration_user (username, password, pwdsalt) VALUES ('${username}', SHA256(CONCAT('${salt}', '${password}')), '${salt}');`

    //         await userTable.query(sql)

    //         res.send("User created successfully")
    //     } catch (error) {
    //         res.status(500).json({ error: "Unable to register", message: error.message })
    //     }
    // }
}

module.exports = authController