const {camps} = require("../utils/connectCAMPS");

class MasterTableController {
    options = {
        "mother_tongue": { data_id: 'mother_tongue_id', data: 'mother_tongue_name', data_master: 'mother_tongue_master' },
        "blood_group": { data_id: 'blood_group_id', data: 'blood_group', data_master: 'blood_group_master' },
        "community": { data_id: 'community_id', data: 'community_name', data_master: 'community_master' },
        "caste": { data_id: 'caste_id', data: 'caste_name', data_master: 'caste_master' },
        "religion": { data_id: 'religion_id', data: 'religion_name', data_master: 'religion_master' },
        "nationality": { data_id: 'nationality_id', data: 'nationality_name', data_master: 'nationality_master' },
        "occupation": { data_id: 'occ_id', data: 'occupation', data_master: 'occupation_master' },
        "designation": { data_id: 'des_id', data: 'designation', data_master: 'designation_master' },
        "city": { data_id: 'city_id', data: 'city_name', data_master: 'city_master' },
        "district": { data_id: 'district_id', data: 'district_name', data_master: 'district_master' },
        "state": { data_id: 'state_id', data: 'state_name', data_master: 'state_master' },
        "country": { data_id: 'country_id', data: 'country_name', data_master: 'country_master' },
        "quota": { data_id: 'quota_id', data: 'quota', data_master: 'quota_master' },
        "school_board": { data_id: 'board_id', data: 'board_name', data_master: 'school_board_master' },
        "sch_qual_id": { data_id: 'qual_id', data: 'qual_name', data_master: 'school_qual_master' },
        "study_medium": { data_id: 'medium_study_id', data: 'medium', data_master: 'medium_study_master' },
        "sch_yr_pass": { data_id: 'year_id', data: 'year', data_master: 'year_pass_master' },
        "batch_id": { data_id: 'batch_id', data: 'batch', data_master: 'batch_master' },
        "acad_yr_id": { data_id: 'acc_year_id', data: 'acc_year', data_master: 'academic_year_master' },
        "branch_id": { data_id: 'branch_id', data: 'branch_name', data_master: 'branch_master' },
        "branch_type": { data_id: 'branch_id', data: 'branch_type', data_master: 'branch_master' },
        "course_id": { data_id: 'course_id', data: 'course_name', data_master: 'course_master' },
        "regulation_id": { data_id: 'regulation_id', data: 'regulation', data_master: 'regulation_master' },
        "dept_id": { data_id: 'dept_id', data: 'dept_name', data_master: 'department_master' },
        "university_id": { data_id: 'university_id', data: 'university_name', data_master: 'university_master' },
        "student_cat_id": { data_id: 'stu_cat_id', data: 'stu_cat', data_master: 'student_category' },
        "boarding_point": { data_id: 'boarding_point_id', data: 'boarding_point', data_master: 'tr_boardingpoint_master' },
    }

    getOptions = async (req, res) => {
        if (req.params.option == 'branch') {
            try {
                const sql = `SELECT branch_id, course_id, branch_name FROM branch_master WHERE delete_status = 0 OR delete_status IS NULL`
                const results = await camps.query(sql)
                const branch_det = results[0].reduce((acc, item) => {
                    acc[item.branch_id] = {
                        course_id: item.course_id,
                        branch_id: item.branch_id,
                        branch_name: item.branch_name,
                    };
                    return acc;
                }, {});
                res.json(branch_det);
            } catch (error) {
                res.status(500).send({ message: 'Error fetching Branch Details from CAMPS' });
            } finally {
                return
            }
        } else if (req.params.option == 'scholarship') {
            try {
                const sql = `SELECT discount_id, discount_name, discount_amount FROM admission_discount_master WHERE delete_status = 0 OR delete_status IS NULL;`
                const results = await camps.query(sql)
                const response = results[0].reduce((acc, item) => {
                    acc[item.discount_id] = {
                        discount_id: item.discount_id,
                        discount_name: item.discount_name,
                        discount_amount: item.discount_amount,
                    }
                    return acc;
                }, {});
                res.json(response);
            } catch (error) {
                res.status(500).send({ message: 'Error fetching Scholarship Details from CAMPS' });
            } finally {
                return
            }
        } else if(req.params.option == 'boarding_point'){
            try {
                const data_id = this.options[req.params.option].data_id
                const data = this.options[req.params.option].data
                const data_master = this.options[req.params.option].data_master
    
                const sql = `SELECT ${data_id}, ${data} FROM ${data_master} WHERE status = 1`
                const results = await camps.query(sql)
                const response = results[0].reduce((acc, item) => {
                    acc[item[data_id]] = item[data];
                    return acc;
                }, {});
                res.json(response);
            } catch (error) {
                res.status(500).send({ error: `Error fetching ${req.params.option} from CAMPS`, message: error.message });
            } finally {
                return
            }
        }

        try {
            const data_id = this.options[req.params.option].data_id
            const data = this.options[req.params.option].data
            const data_master = this.options[req.params.option].data_master

            const sql = `SELECT ${data_id}, ${data} FROM ${data_master} WHERE delete_status = 0 OR delete_status IS NULL`
            const results = await camps.query(sql)
            const response = results[0].reduce((acc, item) => {
                acc[item[data_id]] = item[data];
                return acc;
            }, {});
            res.json(response);
        } catch (error) {
            res.status(500).send({ error: `Error fetching ${req.params.option} from CAMPS`, message: error.message });
        }
    }

    getValue = async (req, res) => {
        try {
            const data_id = this.options[req.params.option].data_id
            const data = this.options[req.params.option].data
            const data_master = this.options[req.params.option].data_master

            const sql = `SELECT ${data} FROM ${data_master} WHERE ${data_id}='${req.params.id}'`
            const results = await camps.query(sql)
            res.json({ value: results[0][0][data] })
        } catch (error) {
            res.status(500).send({ message: `Error fetching value for ${req.params.option} - ${req.params.id} from CAMPS` });
        }
    }
}

module.exports = MasterTableController