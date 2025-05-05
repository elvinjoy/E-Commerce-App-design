const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  editProductController,
  deleteProductController,
  searchProductsController
} = require('../Controller/productController');

const { adminProtect, adminOnly } = require('../middleware/adminAuthMiddleware');

//router.post('/create', adminProtect, adminOnly, upload.array('images', 4), createProductController);
router.get('/all', adminProtect, adminOnly, getAllProductsController);
router.get('/specificproduct/:id', adminProtect, adminOnly, getProductByIdController);
router.put('/edit/:id', adminProtect, adminOnly, upload.array('images', 4), editProductController);
router.delete('/delete/:id', adminProtect, adminOnly, deleteProductController);
router.get('/search', adminProtect, adminOnly, searchProductsController);


module.exports = router;
