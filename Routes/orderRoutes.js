const express = require('express');
const router = express.Router();

// Import the controller function
const { createOrderController } = require('../Controller/orderController');
const { protect } = require('../middleware/userAuthMiddleware'); // Auth middleware

// Define your routes
router.post('/create-order', protect, createOrderController); // The handler function should be createOrderController

module.exports = router;
