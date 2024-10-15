const express = require("express");
const Router = express.Router;

const masterTableRouter = require('./masterTableRouter');
const StudentRegController = require("../controller/StudentReg");

const router = Router();
const studentRegController = new StudentRegController();

router.use('/master', masterTableRouter)

router.route('/student_reg/:application_no')
    .get(studentRegController.getData)
    .put(studentRegController.updateStudentReg)

router.route('/student_reg/new')
    .post(studentRegController.insertNew)

module.exports = router;