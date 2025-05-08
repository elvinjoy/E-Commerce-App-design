const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  user: { type: String, required: true }, // ✅ Allow string IDs
  value: { type: Number, required: true, min: 1, max: 5 }
});


const productSchema = new Schema({
  productId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0 }, // average rating
  ratings: [ratingSchema], // new field
  category: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// ✅ Virtual field to get average rating
productSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.value, 0);
  return parseFloat((total / this.ratings.length).toFixed(1));
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
