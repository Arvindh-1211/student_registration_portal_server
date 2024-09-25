const camps = require("../utils/connectCAMPS");
const db = require("../utils/connectDB");

class StudentRegController {
    getData = async (req, res) => {
        const fields = req.query.fields;
        const applicationNo = req.params.application_no;

        const sql = `
            SELECT ${fields}
            FROM student_registration
            WHERE application_no = ${applicationNo}
        `;

        const connection = await db.getConnection()
        try {
            const result = await connection.query(sql)
            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching data from student_register' });
        } finally {
            connection.release();
        }
    }

    insertNew = async (req, res) => {
        let fields = {
            batch_id: '',
            acad_yr_id: '',
            branch_id: '',
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

        fields.branch_id = req.body.branch_id
        fields.branch_type = fields.branch_id
        fields.student_cat_id = req.body.student_cat_id
        fields.year_of_admission = new Date().getFullYear()

        if (fields.student_cat_id == 12) {
            fields.year_of_study = 'II'
            fields.sem_of_study = 'III'
            fields.year_of_completion = fields.year_of_admission + 3
        } else {
            fields.year_of_study = 'I'
            fields.sem_of_study = 'I'
        }

        let connection = await camps.getConnection()
        try {
            // Getting branch details
            const branch_details = await connection.query(`
                    SELECT course_id, dept_id, branch_type, degree_level, no_of_year
                    FROM branch_master WHERE branch_id=${fields.branch_id}
                `)

            fields.course_id = branch_details[0][0].course_id
            fields.dept_id = branch_details[0][0].dept_id
            fields.degree_level = branch_details[0][0].degree_level
            if(fields.year_of_completion === ''){
                fields.year_of_completion = fields.year_of_admission + branch_details[0][0].no_of_year
            }

            // Getting batch_id
            if (fields.student_cat_id == 12) {
                const batch_id = await connection.query(`
                        SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission}
                    `)
                fields.batch_id = batch_id[0][0]
            } else {
                const batch_id = await connection.query(`
                    SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission - 1}
                    `)
                fields.batch_id = batch_id[0][0].batch_id
            }

            // Getting acad_yr_id
            const acad_yr_id = await connection.query(`
                SELECT acc_year_id FROM academic_year_master WHERE acc_year='${fields.year_of_admission}-${fields.year_of_admission + 1}'
                `)

            fields.acad_yr_id = acad_yr_id[0][0].acc_year_id

        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from master tables', message: error.message });
        } finally {
            connection.release();
        }

        connection = await db.getConnection()
        try {
            const sql = `
                INSERT INTO student_registration (
                ${Object.keys(fields).join(', ')}
                )
                VALUES(
                '${Object.values(fields).join("', '")}'
                )
            `
            // res.send(sql)
            const result = await connection.query(sql)
            res.json({application_no: result[0].insertId})
        } catch (error) {
            res.status(500).send({ error: 'Error inserting data into DB', message: error });
        } finally {
            connection.release();
        }


    }

    updateStudentReg = async (req, res) => {
        const sql = `
            UPDATE student_registration
            SET ${Object.entries(req.body)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(', ')
            }
            WHERE application_no = ${req.params.application_no}
        `;
        const connection = await db.getConnection()
        try {
            const result = await connection.query(sql)
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating student_register' });
        } finally {
            connection.release();
        }
    }
}

module.exports = StudentRegController;