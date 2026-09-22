const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Category = require('../models/Category');

// Helper to make URL slug
const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// @desc    Get courses with search, filter and pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      level,
      priceType, // 'free' or 'paid'
      minRating,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'published' };

    // Search keyword
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { subtitle: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All Levels') {
      query.level = level;
    }

    // Price filter
    if (priceType === 'free') {
      query.price = 0;
    } else if (priceType === 'paid') {
      query.price = { $gt: 0 };
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { enrolledCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline')
      .populate('category', 'name slug icon')
      .sort(sortOption)
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

// @desc    Get featured courses for homepage
// @route   GET /api/courses/featured
// @access  Public
exports.getFeaturedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructor', 'name avatar headline')
      .populate('category', 'name slug icon')
      .sort({ rating: -1, enrolledCount: -1 })
      .limit(8);

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug or ID
// @route   GET /api/courses/:identifier
// @access  Public (Optional auth)
exports.getCourseDetails = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let query;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    const course = await Course.findOne(query)
      .populate('instructor', 'name email avatar headline bio')
      .populate('category', 'name slug icon')
      .populate({
        path: 'sections',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
          select: 'title duration type order isFreePreview quiz',
        },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if current user is enrolled or instructor/admin
    let isEnrolled = false;
    if (req.user) {
      if (
        req.user.role === 'admin' ||
        course.instructor._id.toString() === req.user._id.toString()
      ) {
        isEnrolled = true;
      } else {
        const enrollment = await Enrollment.findOne({
          student: req.user._id,
          course: course._id,
          status: 'active',
        });
        if (enrollment) {
          isEnrolled = true;
        }
      }
    }

    res.json({
      success: true,
      course,
      isEnrolled,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a course (Instructor only)
// @route   POST /api/courses
// @access  Private/Instructor
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      thumbnail,
      category,
      price,
      discountPrice,
      level,
      language,
      duration,
      requirements,
      whatYouWillLearn,
    } = req.body;

    let baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const course = await Course.create({
      title,
      slug,
      subtitle,
      description,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      instructor: req.user.id,
      category,
      price: price || 0,
      discountPrice: discountPrice || 0,
      level: level || 'All Levels',
      language: language || 'English',
      duration: duration || '5 hours',
      requirements: requirements || [],
      whatYouWillLearn: whatYouWillLearn || [],
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully as draft',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor or Admin
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership or admin
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this course',
      });
    }

    // If title changed, update slug
    if (req.body.title && req.body.title !== course.title) {
      let baseSlug = createSlug(req.body.title);
      let slug = baseSlug;
      let counter = 1;
      while (
        await Course.findOne({ slug, _id: { $ne: course._id } })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      req.body.slug = slug;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('instructor', 'name avatar')
      .populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit course for admin approval
// @route   PUT /api/courses/:id/submit
// @access  Private/Instructor
exports.submitCourseForApproval = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit your own courses',
      });
    }

    course.status = 'pending';
    course.rejectionReason = '';
    await course.save();

    res.json({
      success: true,
      message: 'Course submitted for admin review successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor or Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    // Delete associated sections, lessons
    await Lesson.deleteMany({ course: course._id });
    await Section.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course and related lessons removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses created by current logged-in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private/Instructor
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('category', 'name slug')
      .populate('sections')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};
