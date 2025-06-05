const express = require("express");
const Router = express.Router;

const masterTableRouter = require('./masterTableRouter');
const AuthController = require("../controller/AuthController");
const StudentRegController = require("../controller/StudentReg");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = Router();
const authController = new AuthController
const studentRegController = new StudentRegController();

router.route('/login')
    .post(authController.login)

router.use(authMiddleware)

// router.route('/register')
//     .post(roleMiddleware(['admin']), authController.register)

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

router.route('/student_user_details')
    .get(roleMiddleware(['admin', 'manager']), studentRegController.getStudentUserDetails)
    .post(roleMiddleware(['admin', 'manager']), studentRegController.insertStudentUserDetails)

router.route('/incomplete_application')
    .get(roleMiddleware(['admin', 'manager']), studentRegController.getIncompleteApplication)

router.route('/incomplete_application/:application_no')
    .delete(roleMiddleware(['admin', 'manager']), studentRegController.deleteIncompleteApplication)

router.use(roleMiddleware(['admin']))
router.route('/user')
    .get(authController.getUserDetails)
    .post(authController.addUser)

router.route('/user/:id')
    .put(authController.editUser)
    .delete(authController.deleteUser)

module.exports = router;