const express = require('express');
const router = express.Router();
const {
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require('../Controller/categoryController');
const { adminProtect, adminOnly } = require('../middleware/adminAuthMiddleware');

// Admin-only routes
router.post('/create', adminProtect, adminOnly, createCategory);
router.put('/edit/:id', adminProtect, adminOnly, editCategory);
router.delete('/delete/:id', adminProtect, adminOnly, deleteCategory);

// Public route to get all categories
router.get('/all', getAllCategories);

module.exports = router;
