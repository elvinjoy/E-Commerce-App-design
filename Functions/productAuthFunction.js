// ===== productAuthFunction.js =====
const mongoose = require('mongoose'); // ✅ already imported here
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


const getProductsByCategoryLogic = async (req) => {
  const category = req.params.category.toLowerCase();
  const { 
    sortBy = 'title', 
    order = 'asc',
    filter = '',  // New filter parameter for preset sorting options
    minPrice,
    maxPrice,
    minRating,
    stock,
    search
  } = req.query;

  // Build filter query
  const filterQuery = { category };
  
  // Add price filter if provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    filterQuery.price = {};
    if (minPrice !== undefined) filterQuery.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filterQuery.price.$lte = Number(maxPrice);
  }
  
  // Add rating filter if provided
  if (minRating !== undefined) {
    filterQuery.rating = { $gte: Number(minRating) };
  }
  
  // Add stock filter if provided
  if (stock !== undefined) {
    filterQuery.stock = { $gte: Number(stock) };
  }
  
  // Add search in title and description if provided
  if (search) {
    filterQuery.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Set sorting based on filter parameter or fallback to sortBy/order
  let sortOptions = {};
  
  // Handle predefined filter options
  switch (filter.toLowerCase()) {
    case 'latest':
      sortOptions = { createdAt: -1 };
      break;
    case 'a-z':
      sortOptions = { title: 1 };
      break;
    case 'z-a':
      sortOptions = { title: -1 };
      break;
    default:
      // Use the traditional sortBy/order if no predefined filter is selected
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions = { [sortBy]: sortOrder };
  }

  const products = await Product.find(filterQuery)
    .sort(sortOptions)
    .lean();

  const updatedProducts = products.map(product => ({
    ...product,
    images: product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`)
  }));

  return { 
    status: 200, 
    body: { 
      products: updatedProducts,
      total: updatedProducts.length,
      filters: {
        category,
        filter,
        priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null,
        minRating,
        stock,
        search
      }
    } 
  };
};


const submitProductRating = async (productId, userId, ratingValue) => {
  if (ratingValue < 1 || ratingValue > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const product = await Product.findOne({ productId });
  if (!product) {
    throw new Error('Product not found');
  }

  const existingRatingIndex = product.ratings.findIndex(r => r.user === userId);

  if (existingRatingIndex >= 0) {
    product.ratings[existingRatingIndex].value = ratingValue;
  } else {
    product.ratings.push({ user: userId, value: ratingValue });
  }

  // Optional: if you want to keep a static 'rating' field updated
  product.rating = product.averageRating;

  await product.save();

  // Fetch updated product with virtuals
  const updatedProduct = await Product.findOne({ productId }).lean({ virtuals: true });

  return updatedProduct;
};


module.exports = {
  createProductLogic,
  getAllProductsLogic,
  getProductByIdLogic,
  editProductLogic,
  deleteProductLogic,
  searchProductsLogic,
  getProductsByCategoryLogic,
  submitProductRating
};
