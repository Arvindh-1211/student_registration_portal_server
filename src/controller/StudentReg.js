const camps = require("../utils/connectCAMPS");
const db = require("../utils/connectDB");

class StudentRegController {
    getData = async (req, res) => {
        try {
            const fields = req.query.fields;
            const applicationNo = req.params.application_no;

            const sql = `
            SELECT ${fields}
            FROM student_register
            WHERE sno = ${applicationNo}
            `;

            const result = await db.query(sql)
            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from student_register', message: error.message });
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
                    INSERT INTO student_register (
                    ${Object.keys(fields).join(', ')}
                    )
                    VALUES(
                    '${Object.values(fields).join("', '")}'
                    )
                `
                const result = await db.query(sql)
                const application_no = result[0].insertId
                res.send({ application_no: application_no })
            } catch (error) {
                res.status(500).send({ error: 'Error inserting data into student_register', message: error.message });
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
                    .map(([key, value]) => `${key} = ${value === null || value === '' ? null : `'${value}'`} `)
                    .join(', ')
                }
            WHERE sno = ${req.params.application_no}
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
            res.json({ message: "Row inserted" })
        } catch (error) {
            res.status(500).send({ error: 'Error inserting student_additional_det', message: error })
        }
    }

    getStudentAdditionalDet = async (req, res) => {
        try {
            const fields = req.query.fields;
            const applicationNo = req.params.application_no;

            const sql = `
                SELECT ${fields}
                FROM student_additional_det
                WHERE appl_no = ${applicationNo}
            `;

            const result = await db.query(sql)

            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from student_register', message: error.message });
        }
    }

    insertIntoCAMPS = async (req, res) => {
        try {
            // Getting application number from student_reg_temp
            let sql = `INSERT INTO student_reg_temp (ip) VALUES (NULL);`

            // TODO
            const application_no = await camps.query(sql)
            // const application_no = await db.query(sql)

            const APPLICATION_NO = application_no[0].insertId

            const applicationNo = req.params.application_no;

            // Inserting into student_register table
            sql = `SELECT * FROM student_register WHERE sno = ${applicationNo}`;

            let student_reg = await db.query(sql)
            student_reg = student_reg[0][0]
            delete student_reg['sno']
            student_reg['application_no'] = APPLICATION_NO
            if (student_reg['dob']) {
                student_reg['dob'] = new Date(student_reg['dob']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            if (student_reg['tnea_pay_rec_date']) {
                student_reg['tnea_pay_rec_date'] = new Date(student_reg['tnea_pay_rec_date']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            if (student_reg['school_tc_date']) {
                student_reg['school_tc_date'] = new Date(student_reg['school_tc_date']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            student_reg['app_date'] = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')

            let fields = Object.keys(student_reg).join(', ')
            let values = Object.values(student_reg).map(value => {
                if (typeof value === 'string') {
                    return `'${value.replace(/'/g, "''")}'`
                } else if (value === null) {
                    return 'null'
                }
                return value
            }).join(', ')

            sql = `INSERT INTO student_register (${fields}) VALUES (${values})`
            // TODO
            let result = await camps.query(sql)
            // let result = await db.query(sql)


            // Inserting into student_additional_det table
            sql = `SELECT * FROM student_additional_det WHERE appl_no = ${applicationNo}`

            let student_additional_det = await db.query(sql)
            student_additional_det = student_additional_det[0][0]
            student_additional_det['appl_no'] = APPLICATION_NO
            delete student_additional_det['enroll_no']

            fields = Object.keys(student_additional_det).join(', ')
            values = Object.values(student_additional_det).map(value => {
                if (typeof value === 'string') {
                    return `'${value.replace(/'/g, "''")}'`
                } else if (value === null) {
                    return 'null'
                }
                return value
            }).join(', ')

            sql = `INSERT INTO student_additional_det (${fields}) VALUES (${values})`
            // TODO
            result = await camps.query(sql)
            // result = await db.query(sql)

            res.json({ APPLICATION_NO: APPLICATION_NO })

        } catch (error) {
            res.status(500).send({ error: 'Error inserting into CAMPS', message: error });
        }
    }
}

module.exports = StudentRegController;