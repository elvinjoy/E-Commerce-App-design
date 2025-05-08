const razorpay = require("../service/razorpayInstance");
const OrderDetails = require("../Model/orderModel");
const Product = require("../Model/productModel");
const User = require("../Model/userModel"); // Ensure path is correct

const createOrderController = async (req, res) => {
  try {
    const { productId, amount, quantity } = req.body;
    const userId = req.user._id;
    console.log(userId, req.user);
    // Validate the incoming data
    if (!productId || !amount || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Fetch product by productId
    const product = await Product.findOne({ productId });
    if (!product) throw new Error("Product not found");
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Fetch the user making the purchase
    const user = await User.findOne({ userNumber: req.user.userNumber });
    console.log(userId, user);
    if (!user) throw new Error("User not found");

    // Razorpay order creation
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order details to MongoDB (OrderDetails collection)
    await OrderDetails.create({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pincode: user.pincode,
      },
      product: {
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        quantity: quantity, // save quantity of product ordered
      },
      amountPaid: amount * quantity, // total price after quantity
      paymentId: "", // to be filled after payment verification
      orderId: order.id, // store razorpay order ID
      status: "Pending", // pending until payment is completed
    });

    // Reduce the stock of the product based on quantity purchased
    product.stock -= quantity; // subtract purchased quantity from stock
    await product.save(); // save the updated product

    res.status(200).json({
      success: true,
      message: "Order created and saved successfully",
      razorpayOrder: order, // return Razorpay order details
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrderController };
