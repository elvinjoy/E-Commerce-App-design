const razorpay = require("../Config/razorpayInstance");
const OrderDetails = require("../Model/orderModel");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");

const createOrderFunction = async ({ user, productId, quantity, amount }) => {
  if (!productId || !amount || !quantity) {
    throw new Error("Missing required fields");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  // Fetch product
  const product = await Product.findOne({ productId });
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  // Fetch user (again, in case extra validation needed)
  const fullUser = await User.findOne({ userNumber: user.userNumber });
  if (!fullUser) throw new Error("User not found");

  // Create order on Razorpay
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${user._id}_${Date.now()}`,
  });

  // Save order in MongoDB
  await OrderDetails.create({
    user: {
      userId: fullUser._id,
      username: fullUser.username,
      email: fullUser.email,
      phone: fullUser.phone,
      address: fullUser.address,
      pincode: fullUser.pincode,
      state: fullUser.state,
      district: fullUser.district,
    },
    product: {
      productId: product.productId,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      quantity: quantity,
    },
    amountPaid: amount * quantity,
    paymentId: "",
    orderId: order.id,
    status: "Pending",
  });

  // Update product stock
  product.stock -= quantity;
  await product.save();

  return order;
};

const getOrderByOrderIdFunction = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const order = await OrderDetails.findOne({ orderId });

  return order;
};

const updateOrderStatusFunction = async (orderId, status) => {
  if (!orderId || !status) {
    throw new Error("Order ID and status are required");
  }

  const updatedOrder = await OrderDetails.findOneAndUpdate(
    { orderId },
    { $set: { status } },
    { new: true }
  );

  return updatedOrder;
};

module.exports = {
  createOrderFunction,
  updateOrderStatusFunction,
  getOrderByOrderIdFunction,
};
