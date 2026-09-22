const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get complete curriculum for a course (instructor/learner)
// @route   GET /api/curriculum/course/:courseId
// @access  Public (sensitive video/content restricted to enrolled users)
exports.getCurriculum = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const sections = await Section.find({ course: courseId })
      .sort({ order: 1 })
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
        populate: { path: 'quiz', select: 'title passingPercentage timeLimitMinutes' },
      });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a section to course
// @route   POST /api/curriculum/sections
// @access  Private/Instructor or Admin
exports.addSection = async (req, res, next) => {
  try {
    const { title, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    const sectionCount = await Section.countDocuments({ course: courseId });

    const section = await Section.create({
      title,
      course: courseId,
      order: order !== undefined ? order : sectionCount + 1,
      lessons: [],
    });

    course.sections.push(section._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update section
// @route   PUT /api/curriculum/sections/:id
// @access  Private/Instructor or Admin
exports.updateSection = async (req, res, next) => {
  try {
    const { title, order } = req.body;

    let section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const course = await Course.findById(section.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (title) section.title = title;
    if (order !== undefined) section.order = order;

    await section.save();

    res.json({
      success: true,
      message: 'Section updated successfully',
      section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete section
// @route   DELETE /api/curriculum/sections/:id
// @access  Private/Instructor or Admin
exports.deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const course = await Course.findById(section.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Remove lessons in this section
    await Lesson.deleteMany({ section: section._id });

    // Remove section from course.sections
    await Course.findByIdAndUpdate(section.course, {
      $pull: { sections: section._id },
    });

    await Section.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Section and associated lessons deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lesson to section
// @route   POST /api/curriculum/lessons
// @access  Private/Instructor or Admin
exports.addLesson = async (req, res, next) => {
  try {
    const {
      title,
      sectionId,
      type = 'video',
      videoUrl = '',
      duration = '10:00',
      content = '',
      resources = [],
      isFreePreview = false,
      order,
    } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const course = await Course.findById(section.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const lessonCount = await Lesson.countDocuments({ section: sectionId });

    const lesson = await Lesson.create({
      title,
      section: sectionId,
      course: course._id,
      type,
      videoUrl,
      duration,
      content,
      resources,
      isFreePreview,
      order: order !== undefined ? order : lessonCount + 1,
    });

    section.lessons.push(lesson._id);
    await section.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/curriculum/lessons/:id
// @access  Private/Instructor or Admin
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('quiz');

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/curriculum/lessons/:id
// @access  Private/Instructor or Admin
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Section.findByIdAndUpdate(lesson.section, {
      $pull: { lessons: lesson._id },
    });

    await Lesson.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson content (for player)
// @route   GET /api/curriculum/lessons/:id
// @access  Private
exports.getLessonContent = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('quiz');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);

    // If free preview, anyone can view
    if (!lesson.isFreePreview) {
      // Check authorization
      const isOwner = course.instructor.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        const enrollment = await Enrollment.findOne({
          student: req.user.id,
          course: course._id,
          status: 'active',
        });
        if (!enrollment) {
          return res.status(403).json({
            success: false,
            message: 'You must be enrolled in this course to access this lesson',
          });
        }
      }
    }

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};
