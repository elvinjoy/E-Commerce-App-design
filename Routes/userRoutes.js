const express = require('express');
const {
  registerController,
  loginController,
  checkAddressFields,
  updateMissingAddressFields
} = require('../Controller/userController');
const { protect } = require('../middleware/userAuthMiddleware');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/check-address', protect, checkAddressFields);
router.put('/update-address', protect, updateMissingAddressFields);

module.exports = router;
