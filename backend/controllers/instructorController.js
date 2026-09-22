const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Progress = require('../models/Progress');

// @desc    Get instructor dashboard statistics
// @route   GET /api/instructor/stats
// @access  Private/Instructor
exports.getInstructorStats = async (req, res, next) => {
  try {
    const instructorId = req.user.id;

    // Get all courses by instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === 'published').length;
    const pendingCourses = courses.filter((c) => c.status === 'pending').length;

    // Calculate total students across courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: 'active',
    });
    const totalStudents = enrollments.length;

    // Calculate total earnings
    const payments = await Payment.aggregate([
      { $match: { course: { $in: courseIds }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalEarnings = payments.length > 0 ? payments[0].total : 0;

    // Average rating across instructor courses
    let totalRatings = 0;
    let ratedCoursesCount = 0;
    courses.forEach((c) => {
      if (c.rating > 0) {
        totalRatings += c.rating;
        ratedCoursesCount++;
      }
    });
    const averageRating =
      ratedCoursesCount > 0
        ? Math.round((totalRatings / ratedCoursesCount) * 10) / 10
        : 0;

    // Recent enrollments in instructor's courses
    const recentEnrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: 'active',
    })
      .populate('student', 'name email avatar')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalStudents,
        totalEarnings,
        averageRating,
      },
      recentEnrollments,
      coursesSummary: courses.map((c) => ({
        _id: c._id,
        title: c.title,
        status: c.status,
        enrolledCount: c.enrolledCount,
        rating: c.rating,
        numReviews: c.numReviews,
        price: c.price,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students enrolled in instructor courses
// @route   GET /api/instructor/students
// @access  Private/Instructor
exports.getEnrolledStudents = async (req, res, next) => {
  try {
    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: 'active',
    })
      .populate('student', 'name email avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    const studentsWithProgress = await Promise.all(
      enrollments.map(async (e) => {
        const progress = await Progress.findOne({
          student: e.student._id,
          course: e.course._id,
        });

        return {
          enrollmentId: e._id,
          enrolledAt: e.enrolledAt,
          student: e.student,
          course: e.course,
          progress: progress ? progress.percentage : 0,
          isCompleted: progress ? progress.isCompleted : false,
        };
      })
    );

    res.json({
      success: true,
      count: studentsWithProgress.length,
      students: studentsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews on instructor's courses
// @route   GET /api/instructor/reviews
// @access  Private/Instructor
exports.getInstructorReviews = async (req, res, next) => {
  try {
    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map((c) => c._id);

    const reviews = await Review.find({ course: { $in: courseIds } })
      .populate('student', 'name avatar')
      .populate('course', 'title thumbnail')
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
