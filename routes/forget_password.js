const express = require('express');
const router = express.Router();

const forgetPasswordController = require('../controllers/forget_password');
router.get('/password-link', forgetPasswordController.forgetPassword);

router.post('/resetpass-email', forgetPasswordController.sendMail);
router.get('/mail-link',forgetPasswordController.checkMailLink);

router.post('/newPassword',forgetPasswordController.setNewPassword);

module.exports = router;