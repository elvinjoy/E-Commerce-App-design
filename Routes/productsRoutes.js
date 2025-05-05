const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { createProduct, getAllProducts, getProductById } = require('../Controller/productController');
const { adminProtect, adminOnly } = require('../middleware/adminAuthMiddleware');

router.post(
  '/create',
  adminProtect,
  adminOnly,
  upload.array('images', 4),
  createProduct
);

router.get('/all', adminProtect ,adminOnly, getAllProducts);

router.get('/specificproduct/:id', adminProtect ,adminOnly, getProductById);

module.exports = router;
