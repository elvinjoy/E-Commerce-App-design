const { createOrderFunction } = require("../Functions/orderAuthFunction");
const OrderDetails = require("../Model/orderModel");

const createOrderController = async (req, res) => {
  try {
    const { productId, quantity, amount } = req.body;
    const user = req.user;

    const razorpayOrder = await createOrderFunction({
      user,
      productId,
      quantity,
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Order created and saved successfully",
      razorpayOrder,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter["product.title"] = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const orders = await OrderDetails.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createOrderController,
  getAllOrdersController,
};
