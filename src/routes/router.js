const express = require("express");
const Router = express.Router;

const masterTableRouter = require('./masterTableRouter');
const authController = require("../controller/authController");
const StudentRegController = require("../controller/StudentReg");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = Router();
const AuthController = new authController
const studentRegController = new StudentRegController();

router.route('/login')
    .post(AuthController.login)

router.use(authMiddleware)

router.route('/register')
    .post(roleMiddleware(['admin']), AuthController.register)

router.use('/master', masterTableRouter)

router.route('/student_reg/new')
    .post(studentRegController.insertNew)

router.route('/student_reg/:application_no')
    .get(studentRegController.getData)
    .put(studentRegController.updateStudentReg)

router.route('/student_add_det')
    .post(studentRegController.insertStudentAdditionalDet)

router.route('/student_add_det/:application_no')
    .get(studentRegController.getStudentAdditionalDet)

router.route('/insert_into_camps/:application_no')
    .post(studentRegController.insertIntoCAMPS)

router.route('/if_exist')
    .get(studentRegController.ifExist)

module.exports = router;