const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderDetailsSchema = new Schema({
  user: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: String,
    email: String,
    phone: String,
    address: String,
    pincode: String
  },
  product: {
    productId: String,
    title: String,
    description: String,
    price: Number,
    category: String,
    images: [String],
    quantity: { type: Number, required: true } // Added quantity field
  },
  amountPaid: Number,
  paymentId: String,
  orderId: String,
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderDetails', orderDetailsSchema);
