const Category = require('../Model/categoryModel');

// Create Category (already provided in previous responses)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate category name
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new Category({
      name: name.toLowerCase(),
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Edit Category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'New category name is required' });

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if the new name is the same as the current one
    if (existingCategory.name === name.toLowerCase()) {
      return res.status(400).json({ error: 'New category name is the same as the current name' });
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name.toLowerCase() },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }

    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createCategory, editCategory, deleteCategory, getAllCategories };
