const camps = require("../utils/connectCAMPS");

class MasterTableController {
    getBloodGroup = async (req, res) => {
        const sql = `SELECT blood_group_id, blood_group FROM blood_group_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const blood_group = results[0].reduce((acc, item) => {
                acc[item.blood_group_id] = item.blood_group;
                return acc;
            }, {});
            res.json(blood_group);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCommunity = async (req, res) => {
        const sql = `SELECT community_id, community_name FROM community_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const community = results[0].reduce((acc, item) => {
                acc[item.community_id] = item.community_name;
                return acc;
            }, {});
            res.json(community);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Community from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCaste = async (req, res) => {
        const sql = `SELECT caste_id, caste_name FROM caste_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const caste = results[0].reduce((acc, item) => {
                acc[item.caste_id] = item.caste_name;
                return acc;
            }, {});
            res.json(caste);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Caste from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getReligion = async (req, res) => {
        const sql = `SELECT religion_id, religion_name FROM religion_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const religion = results[0].reduce((acc, item) => {
                acc[item.religion_id] = item.religion_name;
                return acc;
            }, {});
            res.json(religion);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching religion from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getNationality = async (req, res) => {
        const sql = `SELECT nationality_id, nationality_name FROM nationality_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const nationality = results[0].reduce((acc, item) => {
                acc[item.nationality_id] = item.nationality_name;
                return acc;
            }, {});
            res.json(nationality);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching nationality from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getOccupation = async (req, res) => {
        const sql = `SELECT occ_id, occupation FROM occupation_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const nationality = results[0].reduce((acc, item) => {
                acc[item.occ_id] = item.occupation;
                return acc;
            }, {});
            res.json(nationality);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching occupation from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getDesignation = async (req, res) => {
        const sql = `SELECT des_id, designation FROM designation_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const nationality = results[0].reduce((acc, item) => {
                acc[item.des_id] = item.designation;
                return acc;
            }, {});
            res.json(nationality);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching designation from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCity = async (req, res) => {
        const sql = `SELECT city_id, city_name FROM city_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const city = results[0].reduce((acc, item) => {
                acc[item.city_id] = item.city_name;
                return acc;
            }, {});
            res.json(city);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching city from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getDistrict = async (req, res) => {
        const sql = `SELECT district_id, district_name FROM district_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const district = results[0].reduce((acc, item) => {
                acc[item.district_id] = item.district_name;
                return acc;
            }, {});
            res.json(district);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching district from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getState = async (req, res) => {
        const sql = `SELECT state_id, state_name FROM state_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const state = results[0].reduce((acc, item) => {
                acc[item.state_id] = item.state_name;
                return acc;
            }, {});
            res.json(state);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching state from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCountry = async (req, res) => {
        const sql = `SELECT country_id, country_name FROM country_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const country = results[0].reduce((acc, item) => {
                acc[item.country_id] = item.country_name;
                return acc;
            }, {});
            res.json(country);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching country from CAMPS' });
        } finally {
            connection.release();
        }
    }
}

module.exports = MasterTableController