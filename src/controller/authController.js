const { JWT_SECRET } = require("../config/config")
const { userTable, camps } = require('../utils/connectCAMPS')
const jwt = require('jsonwebtoken')

class AuthController {
    login = async (req, res) => {
        try {
            const { username, password, loginType } = req.body;

            if (loginType === 'google') {
                const { email } = req.body

                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${email}' AND status = 1`;
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

                let sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}'`
                let result = await camps.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}' AND stu_mobile_no = '${atob(password)}'`

                result = await camps.query(sql);

                const user = result[0][0];

                if (user) {
                    const token = jwt.sign(
                        { user_id: user.tnea_app_no, username: user.student_name, role: 'applicant' },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    const decoded = jwt.verify(token, JWT_SECRET)

                    res.json({ application_no: user.sno, token: token, user_id: user.tnea_app_no, username: user.student_name, role: 'applicant', exp: decoded.exp });
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

                sql = `SELECT * FROM registration_user WHERE username = '${username}' AND password = SHA2(CONCAT('${atob(password)}', '${pwdsalt}'), 256) AND status = 1`

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
            console.log(error);
            
            res.status(500).json({ error: "Unable to login", message: error.message });
        }
    };


    addUser = async (req, res) => {
        try {
            const { email, role } = req.body

            const sql = `INSERT INTO registration_user (username, role) VALUES ('${email}', '${role}');`

            await userTable.query(sql)

            res.send("User added successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to add user", message: error.message })
        }
    }
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

module.exports = AuthController