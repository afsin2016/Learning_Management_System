const Wishlist = require('../models/Wishlist');
const Course = require('../models/Course');

// @desc    Get student wishlist
// @route   GET /api/wishlist
// @access  Private/Student
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ student: req.user.id }).populate({
      path: 'courses',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name slug' },
      ],
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        student: req.user.id,
        courses: [],
      });
    }

    res.json({
      success: true,
      count: wishlist.courses.length,
      wishlist: wishlist.courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle course in wishlist
// @route   POST /api/wishlist/toggle/:courseId
// @access  Private/Student
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let wishlist = await Wishlist.findOne({ student: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        student: req.user.id,
        courses: [],
      });
    }

    const courseIndex = wishlist.courses.findIndex(
      (id) => id.toString() === courseId.toString()
    );

    let isAdded = false;
    if (courseIndex > -1) {
      wishlist.courses.splice(courseIndex, 1);
      isAdded = false;
    } else {
      wishlist.courses.push(courseId);
      isAdded = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      message: isAdded ? 'Course added to wishlist' : 'Course removed from wishlist',
      isWishlisted: isAdded,
      courses: wishlist.courses,
    });
  } catch (error) {
    next(error);
  }
};
