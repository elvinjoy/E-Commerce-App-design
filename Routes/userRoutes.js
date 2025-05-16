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
  displaySpecificUserController,
  searchUserController
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
router.get('/search-user/:value',adminProtect, searchUserController); // Changed to value

module.exports = router;
