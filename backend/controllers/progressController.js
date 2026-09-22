const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// Helper to generate unique Certificate ID
const generateCertificateId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CERT-${timestamp}-${randomStr}`;
};

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Private/Student
exports.getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let progress = await Progress.findOne({
      student: req.user.id,
      course: courseId,
    }).populate('completedLessons', 'title type');

    if (!progress) {
      progress = await Progress.create({
        student: req.user.id,
        course: courseId,
        completedLessons: [],
        percentage: 0,
        isCompleted: false,
      });
    }

    // Check certificate if completed
    let certificate = null;
    if (progress.isCompleted) {
      certificate = await Certificate.findOne({
        student: req.user.id,
        course: courseId,
      });
    }

    res.json({
      success: true,
      progress,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle lesson completion status & auto-generate certificate at 100%
// @route   POST /api/progress/:courseId/lessons/:lessonId
// @access  Private/Student
exports.toggleLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let progress = await Progress.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!progress) {
      progress = new Progress({
        student: req.user.id,
        course: courseId,
        completedLessons: [],
        currentLesson: lessonId,
      });
    }

    const lessonExistsIndex = progress.completedLessons.findIndex(
      (id) => id.toString() === lessonId.toString()
    );

    if (lessonExistsIndex > -1) {
      // Toggle off
      progress.completedLessons.splice(lessonExistsIndex, 1);
    } else {
      // Toggle on
      progress.completedLessons.push(lessonId);
      progress.currentLesson = lessonId;
    }

    // Count total lessons in this course
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedCount = progress.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    progress.percentage = percentage;

    let certificateCreated = null;

    if (percentage >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();

      // Check if certificate already issued
      let certificate = await Certificate.findOne({
        student: req.user.id,
        course: courseId,
      });

      if (!certificate) {
        certificate = await Certificate.create({
          certificateId: generateCertificateId(),
          student: req.user.id,
          course: courseId,
          instructor: course.instructor,
          issueDate: new Date(),
          gradeOrPercentage: 100,
        });
        certificateCreated = certificate;
      }
    } else if (percentage < 100 && progress.isCompleted) {
      // If student unmarks a lesson
      progress.isCompleted = false;
    }

    await progress.save();

    res.json({
      success: true,
      message:
        lessonExistsIndex > -1
          ? 'Lesson marked as uncompleted'
          : 'Lesson marked as completed',
      progress,
      certificate: certificateCreated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current active lesson
// @route   PUT /api/progress/:courseId/current-lesson
// @access  Private/Student
exports.setCurrentLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { currentLesson: lessonId },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};
