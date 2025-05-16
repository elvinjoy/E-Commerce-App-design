const express = require('express');
const {
  registerController,
  loginController,
  checkAddressFields,
  updateMissingAddressFields,
  sendOtpController,
  verifyOtpController,
  resetPasswordController,
  displayAllUsersController,
  displaySpecificUserController
} = require('../Controller/userController');
const { protect } = require('../middleware/userAuthMiddleware');
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/check-address', protect, checkAddressFields);
router.put('/update-address', protect, updateMissingAddressFields);

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post('/reset-password', resetPasswordController);

router.get('/all-users',adminProtect, displayAllUsersController);
router.get('/specific-user/:userNumber',adminProtect, displaySpecificUserController);
module.exports = router;
