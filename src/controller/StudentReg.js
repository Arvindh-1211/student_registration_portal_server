const camps = require("../utils/connectCAMPS");
const db = require("../utils/connectDB");

class StudentRegController {
    getData = async (req, res) => {
        const fields = req.query.fields;
        const applicationNo = req.params.application_no;

        const sql = `
            SELECT ${fields}
            FROM student_register
            WHERE application_no = ${applicationNo}
        `;

        try {
            const result = await db.query(sql)
            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from student_register', message: error.message });
        }
    }

    insertNew = async (req, res) => {
        let fields = {
            application_no: '',
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

        try {
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
            if (fields.student_cat_id == 12) {
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

            // Getting application number from student_reg_temp
            try {
                const sql = `INSERT INTO student_reg_temp (ip) VALUES (NULL);`

                const result = await db.query(sql)

                fields.application_no = result[0].insertId

                // Inserintg the values in the student_register table
                try {
                    const sql = `
                    INSERT INTO student_register (
                    ${Object.keys(fields).join(', ')}
                    )
                    VALUES(
                    '${Object.values(fields).join("', '")}'
                    )
                `
                    const result = await db.query(sql)
                    res.send({ application_no: fields.application_no })
                } catch (error) {
                    res.status(500).send({ error: 'Error inserting data into student_register', message: error.message });
                }
            } catch (error) {
                res.status(500).send({ error: 'Error inserting data into student_reg_temp', message: error })
            }
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from master tables', message: error.message });
        }

    }

    updateStudentReg = async (req, res) => {
        try {
            const sql = `
            UPDATE student_register
            SET ${Object.entries(req.body)
                    .map(([key, value]) => `${key} = ${value === null ? value : `'${value}'`} `)
                    .join(', ')
                }
            WHERE application_no = ${req.params.application_no}
        `;

            const result = await db.query(sql)
            res.send(result);
        } catch (error) {
            res.status(500).send({ error: 'Error updating student_register', message: error });
        }
    }

    insertStudentAdditionalDet = async (req, res) => {
        try {

            let sql = `SELECT appl_no FROM student_additional_det WHERE appl_no=${req.body.appl_no}`

            const isPresent = await db.query(sql)
            if (!isPresent[0][0]) {

                const fields = Object.keys(req.body).join(', ');
                const values = Object.values(req.body).map(value => {
                    if (typeof value === 'string') {
                        return `'${value.replace(/'/g, "''")}'`
                    }
                    return value
                }).join(', ')

                sql = `INSERT INTO student_additional_det (${fields}) VALUES (${values})`

            } else {

                sql = `
                    UPDATE student_additional_det
                    SET ${Object.entries(req.body)
                        .map(([key, value]) => `${key} = ${value === null ? value : `'${value}'`} `)
                        .join(', ')
                    }
                    WHERE appl_no = ${req.body.appl_no}
                `;

            }
            const result = await db.query(sql)
            res.json({message: "Row inserted"})
        } catch (error) {
            res.status(500).send({ error: 'Error inserting student_additional_det', message: error })
        }
    }
}

module.exports = StudentRegController;