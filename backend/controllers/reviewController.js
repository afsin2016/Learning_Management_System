const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Add review for course
// @route   POST /api/reviews
// @access  Private/Student
exports.addReview = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5',
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a comment for your review',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
      status: 'active',
    });

    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only enrolled students can review this course',
      });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course',
      });
    }

    const review = await Review.create({
      student: req.user.id,
      course: courseId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'student',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Author or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (
      review.student.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
