const {
  createOrderFunction,
  updateOrderStatusFunction,
  getOrderByOrderIdFunction,
} = require("../helper/orderAuthFunction");
const OrderDetails = require("../Model/orderModel");
const User = require("../Model/userModel");

const createOrderController = async (req, res) => {
  try {
    const { productId, quantity, amount, addressIndex } = req.body;
    const user = req.user;

    // Fetch the full user with addresses
    const dbUser = await User.findOne({ userNumber: user.userNumber });

    // Validate address selection
    if (
      !dbUser ||
      !dbUser.addresses ||
      dbUser.addresses.length === 0 ||
      addressIndex === undefined ||
      addressIndex < 0 ||
      addressIndex >= dbUser.addresses.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address selection. Please choose a valid address.",
      });
    }

    const selectedAddress = dbUser.addresses[addressIndex];

    const razorpayOrder = await createOrderFunction({
      user,
      productId,
      quantity,
      amount,
      address: selectedAddress,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
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
      filter = {
        $or: [
          { "product.title": { $regex: search, $options: "i" } },
          { "user.username": { $regex: search, $options: "i" } },
          { "user.email": { $regex: search, $options: "i" } },
        ],
      };
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const updatedOrder = await updateOrderStatusFunction(orderId, status);

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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
  updateOrderStatusController,
};
