const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Payment = require('../models/Payment');
const Section = require('../models/Section');

// @desc    Enroll in a course (free or mock payment checkout)
// @route   POST /api/enrollments
// @access  Private/Student
exports.enrollInCourse = async (req, res, next) => {
  try {
    const { courseId, paymentMethod = 'Card' } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This course is not currently open for enrollment',
      });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id,
    });

    if (existingEnrollment && existingEnrollment.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    const pricePaid = course.discountPrice > 0 ? course.discountPrice : course.price;
    let payment = null;

    // If course is paid, record mock payment
    if (pricePaid > 0) {
      const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      payment = await Payment.create({
        student: req.user.id,
        course: course._id,
        amount: pricePaid,
        paymentMethod,
        transactionId,
        status: 'completed',
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: course._id,
      payment: payment ? payment._id : null,
      pricePaid,
      status: 'active',
    });

    // Determine first lesson
    let firstLessonId = null;
    const firstSection = await Section.findOne({ course: course._id }).sort({ order: 1 }).populate('lessons');
    if (firstSection && firstSection.lessons.length > 0) {
      firstLessonId = firstSection.lessons[0]._id;
    }

    // Initialize progress record
    await Progress.findOneAndUpdate(
      { student: req.user.id, course: course._id },
      {
        student: req.user.id,
        course: course._id,
        completedLessons: [],
        currentLesson: firstLessonId,
        percentage: 0,
        isCompleted: false,
      },
      { upsert: true, new: true }
    );

    // Increment course enrolledCount
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student enrolled courses with progress
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
exports.getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
      status: 'active',
    })
      .populate({
        path: 'course',
        populate: [
          { path: 'instructor', select: 'name avatar' },
          { path: 'category', select: 'name slug' },
        ],
      })
      .sort({ createdAt: -1 });

    // Attach progress to each course
    const myCourses = await Promise.all(
      enrollments
        .filter((e) => e.course != null)
        .map(async (e) => {
          const progress = await Progress.findOne({
            student: req.user.id,
            course: e.course._id,
          });

          return {
            enrollmentId: e._id,
            enrolledAt: e.enrolledAt,
            course: e.course,
            progress: progress
              ? {
                  percentage: progress.percentage,
                  completedLessonsCount: progress.completedLessons.length,
                  isCompleted: progress.isCompleted,
                  currentLesson: progress.currentLesson,
                  completedAt: progress.completedAt,
                }
              : { percentage: 0, completedLessonsCount: 0, isCompleted: false },
          };
        })
    );

    res.json({
      success: true,
      count: myCourses.length,
      courses: myCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check enrollment status for a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
exports.checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
      status: 'active',
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};
