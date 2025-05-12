// ===== productController.js =====

const {
  createProductLogic,
  getAllProductsLogic,
  getProductByIdLogic,
  editProductLogic,
  deleteProductLogic,
  searchProductsLogic,
  getProductsByCategoryLogic,
  submitProductRating,
} = require("../Functions/productAuthFunction");

const Product = require("../Model/productModel");

const createProductController = async (req, res) => {
  try {
    const response = await createProductLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const response = await getAllProductsLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const response = await getProductByIdLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editProductController = async (req, res) => {
  try {
    const response = await editProductLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const response = await deleteProductLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const response = await searchProductsLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductsByCategoryController = async (req, res) => {
  try {
    const response = await getProductsByCategoryLogic(req);
    res.status(response.status).json(response.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rateProductController = async (req, res) => {
  try {
    const { productId, rating } = req.body;
    const userId = req.user.userNumber;

    const product = await submitProductRating(productId, userId, rating);

    res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductsByRating = async (req, res) => {
  try {
    const products = await Product.find().lean({ virtuals: true });

    const sorted = products.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json(sorted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products by rating" });
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  editProductController,
  deleteProductController,
  searchProductsController,
  getProductsByCategoryController,
  rateProductController,
  getProductsByRating,
};
