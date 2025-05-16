const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderDetailsSchema = new Schema({
  user: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
    state: String,
    district: String
  },
  product: {
    productId: String,
    title: String,
    description: String,
    price: Number,
    category: String,
    images: [String],
    quantity: { type: Number, required: true }
  },
  amountPaid: Number,
  paymentId: String,
  paymentMethod: { type: String, default: 'prepaid', required: false },
  paymentType: { type: String, default: 'offline', required: false },
  orderId: String,
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderDetails', orderDetailsSchema);
