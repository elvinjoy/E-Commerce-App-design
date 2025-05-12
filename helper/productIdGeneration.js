const Product = require('../Model/productModel');

const generateProductId = async () => {
  const count = await Product.countDocuments();
  const nextId = count + 1;
  return `PROD-${String(nextId).padStart(4, '0')}`;
};

module.exports = generateProductId;
