const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/change-password', authController.changePassword);
router.post("/reset-password-token", authController.resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", authController.resetPassword);
router.post("/google", authController.googleLogin);

module.exports = router;
