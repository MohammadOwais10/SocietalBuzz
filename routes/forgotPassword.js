const express = require('express');
const router = express.Router();
const forgotPassword = require('../controllers/forgotPassword_controller');

router.get('/enter-email', forgotPassword.renderEmail);
router.post('/send-mail', forgotPassword.generateToken_And_sendMail);
router.get('/reset', forgotPassword.changePasswordReset);
router.post('/password-changed', forgotPassword.passwordChanged);

module.exports = router;
