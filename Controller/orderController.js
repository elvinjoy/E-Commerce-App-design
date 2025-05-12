const { createOrderFunction, updateOrderStatusFunction, getOrderByOrderIdFunction } = require("../Functions/orderAuthFunction");
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


const getOrderByOrderIdController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderByOrderIdFunction(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updatedOrder = await updateOrderStatusFunction(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  createOrderController,
  getAllOrdersController,
  getOrderByOrderIdController,
  updateOrderStatusController
};
