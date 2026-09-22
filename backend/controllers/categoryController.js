const Category = require('../models/Category');
const Course = require('../models/Course');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Update courseCount dynamically
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Course.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          ...cat.toObject(),
          courseCount: count,
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    let category;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id);
    } else {
      category = await Category.findOne({ slug: req.params.id });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const categoryExists = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists',
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'BookOpen',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if courses exist under this category
    const coursesCount = await Course.countDocuments({ category: category._id });
    if (coursesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${coursesCount} associated courses.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
