// ===== productController.js =====

const {
  createProductLogic,
  getAllProductsLogic,
  getProductByIdLogic,
  editProductLogic,
  deleteProductLogic,
  searchProductsLogic
} = require('../Functions/productAuthFunction');

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

module.exports = {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  editProductController,
  deleteProductController,
  searchProductsController
};