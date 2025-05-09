const express = require("express");
const router = express.Router();
const { createOrderController, getAllOrdersController } = require("../Controller/orderController");
const { protect } = require("../middleware/userAuthMiddleware"); // if you use one
const { adminProtect } = require("../middleware/adminAuthMiddleware"); // if you use one

// CREATE ORDER
router.post("/create-order", protect, createOrderController);

// GET ALL ORDERS (with optional search)
router.get("/all", adminProtect, getAllOrdersController);

module.exports = router;
