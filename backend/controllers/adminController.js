const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// @desc    Get Admin Dashboard Stats & Chart Data
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const totalEnrollments = await Enrollment.countDocuments();

    // Calculate total revenue from completed payments
    const payments = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = payments.length > 0 ? payments[0].total : 0;

    // Monthly revenue simulation/aggregation (last 6 months)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Categories with course count
    const categories = await Category.find();
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Course.countDocuments({ category: cat._id });
        return {
          name: cat.name,
          courses: count,
        };
      })
    );

    // Recent 5 enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email avatar')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalEnrollments,
        totalRevenue,
      },
      monthlyRevenue,
      categoryStats,
      recentEnrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filter
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block / Unblock a user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin users cannot be blocked',
      });
    }

    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been ${user.status === 'blocked' ? 'blocked' : 'unblocked'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject instructor application
// @route   PUT /api/admin/instructors/:id/approval
// @access  Private/Admin
exports.reviewInstructor = async (req, res, next) => {
  try {
    const { isApproved, rejectionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'instructor') {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    user.instructorDetails = user.instructorDetails || {};
    user.instructorDetails.isApproved = !!isApproved;
    if (isApproved) {
      user.instructorDetails.approvedAt = new Date();
      user.instructorDetails.rejectionReason = '';
      user.status = 'active';
    } else {
      user.instructorDetails.rejectionReason = rejectionReason || 'Application rejected by administrator';
    }

    await user.save();

    res.json({
      success: true,
      message: isApproved ? 'Instructor approved successfully' : 'Instructor rejected',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses for admin
// @route   GET /api/admin/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject course
// @route   PUT /api/admin/courses/:id/status
// @access  Private/Admin
exports.reviewCourse = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // 'published' or 'rejected'

    if (!['published', 'rejected', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course status provided',
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.status = status;
    if (status === 'rejected') {
      course.rejectionReason = rejectionReason || 'Course did not meet our quality guidelines.';
    } else if (status === 'published') {
      course.rejectionReason = '';
    }

    await course.save();

    res.json({
      success: true,
      message: `Course has been ${status === 'published' ? 'approved & published' : status}`,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform enrollments
// @route   GET /api/admin/enrollments
// @access  Private/Admin
exports.getAllEnrollments = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const total = await Enrollment.countDocuments();
    const enrollments = await Enrollment.find()
      .populate('student', 'name email avatar')
      .populate('course', 'title price')
      .populate('payment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: enrollments.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('student', 'name email avatar')
      .populate('course', 'title')
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
