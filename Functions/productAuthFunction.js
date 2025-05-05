// ===== productAuthFunction.js =====

const Product = require('../Model/productModel');
const Category = require('../Model/categoryModel');
const generateProductId = require('./productIdGeneration');

const createProductLogic = async (req) => {
  const { title, description, price, stock, rating, category } = req.body;

  if (!title || !description || !price || !stock || !category) {
    return { status: 400, body: { error: 'All required fields must be filled' } };
  }

  const existingCategory = await Category.findOne({ name: category.toLowerCase() });
  if (!existingCategory) {
    return { status: 400, body: { error: `Category '${category}' does not exist` } };
  }

  const images = req.files?.map(file => file.filename) || [];
  if (images.length > 4) {
    return { status: 400, body: { error: 'Maximum 4 images allowed' } };
  }

  const productId = await generateProductId();

  const product = new Product({
    productId,
    title,
    description,
    price,
    stock,
    rating: rating || 0,
    category: category.toLowerCase(),
    images
  });

  await product.save();
  return { status: 201, body: { message: 'Product created successfully', product } };
};

const getAllProductsLogic = async (req) => {
  const products = await Product.find().lean();
  const updatedProducts = products.map(product => ({
    ...product,
    images: product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`)
  }));
  return { status: 200, body: { products: updatedProducts } };
};

const getProductByIdLogic = async (req) => {
  const product = await Product.findOne({ productId: req.params.id }).lean();
  if (!product) return { status: 404, body: { error: 'Product not found' } };

  product.images = product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`);
  return { status: 200, body: { product } };
};

const editProductLogic = async (req) => {
  const { title, description, price, stock, rating, category } = req.body;
  const { id } = req.params;

  const product = await Product.findOne({ productId: id });
  if (!product) return { status: 404, body: { error: 'Product not found' } };

  if (category) {
    const existingCategory = await Category.findOne({ name: category.toLowerCase() });
    if (!existingCategory) {
      return { status: 400, body: { error: `Category '${category}' does not exist` } };
    }
    product.category = category.toLowerCase();
  }

  product.title = title || product.title;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  product.rating = rating !== undefined ? rating : product.rating;

  const newImages = req.files?.map(file => file.filename) || [];
  if (newImages.length > 0) {
    if (newImages.length > 4) {
      return { status: 400, body: { error: 'Maximum 4 images allowed' } };
    }
    product.images = newImages;
  }

  await product.save();
  return { status: 200, body: { message: 'Product updated successfully', product } };
};

const deleteProductLogic = async (req) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ productId: id });
  if (!product) return { status: 404, body: { error: 'Product not found' } };

  return { status: 200, body: { message: 'Product deleted successfully' } };
};

const searchProductsLogic = async (req) => {
  const query = req.query.q;
  if (!query) {
    return { status: 400, body: { error: 'Search query missing' } };
  }

  const products = await Product.find({
    title: { $regex: query, $options: 'i' }
  }).lean();

  const updatedProducts = products.map(product => ({
    ...product,
    images: product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`)
  }));

  return { status: 200, body: { results: updatedProducts } };
};

module.exports = {
  createProductLogic,
  getAllProductsLogic,
  getProductByIdLogic,
  editProductLogic,
  deleteProductLogic,
  searchProductsLogic
};
