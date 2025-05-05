const express = require('express');
const { adminRegisterController, adminLoginController } = require('../Controller/adminController');
const router = express.Router();

// Admin routes
router.post('/register', adminRegisterController);
router.post('/login', adminLoginController);

module.exports = router;
