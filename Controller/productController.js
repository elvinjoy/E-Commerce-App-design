const Product = require('../Model/productModel');
const Category = require('../Model/categoryModel');
const generateProductId = require('../Functions/productIdGeneration');

const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, rating, category } = req.body;

    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // ✅ Check if category exists
    const existingCategory = await Category.findOne({ name: category.toLowerCase() });
    if (!existingCategory) {
      return res.status(400).json({ error: `Category '${category}' does not exist` });
    }

    const images = req.files?.map(file => file.filename) || [];
    if (images.length > 4) {
      return res.status(400).json({ error: 'Maximum 4 images allowed' });
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
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().lean();
  
      const updatedProducts = products.map(product => ({
        ...product,
        images: product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`)
      }));
  
      res.status(200).json({ products: updatedProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getProductById = async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id }).lean();
  
      if (!product) return res.status(404).json({ error: 'Product not found' });
  
      product.images = product.images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`);
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
module.exports = { createProduct, getAllProducts, getProductById };
