const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: (val) => val.toLowerCase(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
