const camps = require("../utils/connectCAMPS");

class MasterTableController {
    getBloodGroup = async (req, res) => {
        const sql = `SELECT blood_group_id, blood_group FROM blood_group_master`

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            const blood_group = results.reduce((acc, current) => {
                acc[current.blood_group_id] = current.blood_group;
                return acc;
            }, {});
            res.json(blood_group);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }

        // camps.query(sql, (err, results) => {
        //     if (err) {
        //         console.error(err);
        //         res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        //     } else {
        //         const blood_group = results.reduce((acc, current) => {
        //             acc[current.blood_group_id] = current.blood_group;
        //             return acc;
        //         }, {});
        //         res.json(blood_group);
        //     }
        // });
    }

    getCommunity = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCaste = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getReligion = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getNationality = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCity = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getDistrict = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getState = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }

    getCountry = async (req, res) => {
        const sql = ``

        const connection = await camps.getConnection()
        try {
            const results = await connection.query(sql)
            res.json();
        } catch (error) {
            res.status(500).send({ message: 'Error fetching Blood Group from CAMPS' });
        } finally {
            connection.release();
        }
    }
}

module.exports = MasterTableController