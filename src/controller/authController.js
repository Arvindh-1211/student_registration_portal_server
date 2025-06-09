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

                // Check if user has already registered
                let sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}'`
                let result = await camps.query(sql);

                
                // Insetion of new user in pre_student_register table if the user logins for the first time
                if (result[0].length === 0) {
                    sql = `SELECT * FROM registration_user_details WHERE application_id = '${username}' AND mobile = '${atob(password)}'`
                    result = await camps.query(sql);

                    let row = result[0][0];
                    if (!row) {
                        return res.status(400).json({ message: "Invalid Credentials" });
                    }
                    
                    
                    let admissionType,  admissionQuota
                    if(username[0] === 'G'){
                        admissionQuota = 'GOVERNMENT'
                    }
                    else if (username[0] === 'M') {
                        admissionQuota = 'MANAGEMENT'
                    }
                    else{
                        return res.status(400).json({ message: "Invalid Credentials" });
                    }

                    if(username[1] == 'L'){
                        admissionType = 'LATERAL'
                    }
                    else {
                        admissionType = 'REGULAR'
                    }

                    // Insert the row into the database
                    let fields = {
                        tnea_app_no: row.application_id,
                        gender: row.gender,
                        stu_mobile_no: row.mobile,
                        stu_email_id: row.email,
                        seat_cat: '',

                        // First graduate details
                        // adm_sch_name_1: row.first_graduate === 'Yes' ? 'FIRST GRADUATE.' : '',
                        // adm_sch_amt_1:  row.first_graduate === 'Yes' ? '25000' : '',

                        // To be formatted
                        student_name: '',
                        initial: '',

                        // To be fetched from master tables
                        branch_id: '',
                        community_id: '',

                        batch_id: '',
                        acad_yr_id: '',
                        course_id: '',
                        dept_id: '',
                        branch_type: '',
                        degree_level: '',
                        year_of_admission: '',
                        year_of_completion: '',
                        regulation_id: '',
                        university_id: '5',
                        student_cat_id: '',
                        year_of_study: '',
                        sem_of_study: '',
                        section: 'A',
                    }

                    if (admissionType == "LATERAL") {
                        fields.student_cat_id = 12;
                    }
                    else {
                        fields.student_cat_id = 11; //REGULAR
                    }

                    if (admissionQuota == "GOVERNMENT") {
                        fields.seat_cat = 'GOVERNMENT';
                    }
                    else {
                        fields.seat_cat = 'MANAGEMENT';
                    }

                    try {
                        // Getting name and initial
                        const { initial, name } = ((p) => ({
                            initial: p.filter(w => /^[A-Z]$/.test(w)).join(' '),
                            name: p.filter(w => !/^[A-Z]$/.test(w)).join(' ')
                        }))(row.name.toUpperCase().trim().split(/\s+/));
                        fields.initial = initial
                        fields.student_name = name

                        // Fetching community_id from community_master
                        try {
                            const community_id = await camps.query(`
                                SELECT community_id FROM community_master WHERE community_name='${row.community}'
                            `)
                            fields.community_id = community_id?.[0]?.[0]?.community_id
                        } catch (error) {
                            console.error(`Error fetching community_id: ${error.message}`);
                            return res.status(500).json({ error: "Unable to fetch community_id" });
                        }

                        const branch_id = await camps.query(`
                                SELECT branch_id FROM branch_master WHERE branch_name='${row.branch.toUpperCase()}' AND degree_level='UG'
                            `)
                        fields.branch_id = branch_id?.[0]?.[0]?.branch_id

                        fields.branch_type = fields.branch_id
                        fields.year_of_admission = new Date().getFullYear()

                        if (fields.student_cat_id == 12) {
                            fields.year_of_study = 'II'
                            fields.sem_of_study = 'III'
                            fields.year_of_completion = fields.year_of_admission + 3
                        } else {
                            fields.year_of_study = 'I'
                            fields.sem_of_study = 'I'
                        }

                        // Getting branch details
                        const branch_details = await camps.query(`
                                SELECT course_id, dept_id, branch_type, degree_level, no_of_year
                                FROM branch_master WHERE branch_id=${fields.branch_id}
                            `)
                        fields.course_id = branch_details[0][0].course_id
                        fields.dept_id = branch_details[0][0].dept_id
                        fields.degree_level = branch_details[0][0].degree_level

                        if (fields.year_of_completion === '') {
                            fields.year_of_completion = fields.year_of_admission + branch_details[0][0].no_of_year
                        }

                        // Getting regulation_id
                        let year_master_id = ''
                        if (fields.degree_level == 'RS') {
                            year_master_id = '4'
                        }
                        else if (fields.degree_level == 'PG') {
                            year_master_id = '3'
                        }
                        else if (fields.degree_level == 'UG' && fields.student_cat_id == 12) {
                            year_master_id = '2'
                        }
                        else {
                            year_master_id = '1'
                        }
                        const regulation_id = await camps.query(`
                            SELECT regulation FROM year_master WHERE id=${year_master_id}
                        `)
                        fields.regulation_id = regulation_id[0][0].regulation

                        // Getting batch_id
                        if (fields.student_cat_id == 11) {
                            const batch_id = await camps.query(`
                                    SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission}
                                `)
                            fields.batch_id = batch_id[0][0].batch_id
                        } else {
                            const batch_id = await camps.query(`
                                SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission - 1}
                                `)
                            fields.batch_id = batch_id[0][0].batch_id
                        }

                        const acad_yr_id = await camps.query(`
                            SELECT acc_year_id FROM academic_year_master WHERE acc_year='${fields.year_of_admission}-${fields.year_of_admission + 1}'
                            `)

                        fields.acad_yr_id = acad_yr_id[0][0].acc_year_id

                        try {
                            const sql = `
                                INSERT INTO pre_student_register (
                                ${Object.keys(fields).join(', ')}
                                )
                                VALUES(
                                '${Object.values(fields).join("', '")}'
                                )
                            `
                            
                            const result = await camps.query(sql)
                            const application_no = result[0].insertId

                        } catch (error) {
                            console.error(`Error inserting row: ${JSON.stringify(row)} - ${error.message}`);
                            console.log(error);
                            return res.status(500).json({ error: "Error inserting row" });
                        }
                    } catch (error) {
                        console.error(`Error inserting row: ${JSON.stringify(row)} - ${error.message}`);
                        console.log(error);
                        return res.status(500).json({ error: "Unable to insert row" });
                    }
                }

                sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}' AND stu_mobile_no = '${atob(password)}'`

                result = await camps.query(sql);

                const user = result[0][0];

                // Generate JWT token
                if (user) {
                    const token = jwt.sign(
                        { user_id: user.tnea_app_no, username: user.student_name, role: user.seat_cat },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    const decoded = jwt.verify(token, JWT_SECRET)

                    res.json({ application_no: user.sno, token: token, user_id: user.tnea_app_no, username: user.student_name, name: user.student_name, role: user.seat_cat, exp: decoded.exp });
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

            let sql = `SELECT * FROM registration_user WHERE username = '${email}'`
            let result = await userTable.query(sql)

            if (result[0][0] && result[0][0].status == 1) {
                return res.status(400).json({ message: "User already exists" })
            }
            else if (result[0][0] && result[0][0].status == 0) {
                sql = `UPDATE registration_user SET status = 1 WHERE username = '${email}'`
                await userTable.query(sql)
            } else {
                sql = `INSERT INTO registration_user (username, role) VALUES ('${email}', '${role}');`
                await userTable.query(sql)
            }

            res.send("User added successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to add user", message: error.message })
        }
    }

    getUserDetails = async (req, res) => {
        try {
            const sql = `SELECT user_id, username AS email, role FROM registration_user WHERE status = 1`

            const result = await userTable.query(sql)

            res.json(result[0])
        } catch (error) {
            res.status(500).json({ error: "Unable to fetch user details", message: error.message })
        }
    }

    editUser = async (req, res) => {
        try {
            const user_id = req.params.id
            const { username, role } = req.body

            let sql = `UPDATE registration_user SET username = '${username}', role = '${role}' WHERE user_id = ${user_id}`

            await userTable.query(sql)

            res.send("User updated successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to update user", message: error.message })
        }
    }

    deleteUser = async (req, res) => {
        try {
            const user_id = req.params.id

            let sql = `UPDATE registration_user SET status = 0 WHERE user_id = '${user_id}'`

            await userTable.query(sql)

            res.send("User deleted successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to delete user", message: error.message })
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