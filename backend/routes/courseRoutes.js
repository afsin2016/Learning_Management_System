const express = require('express');
const router = express.Router();
const {
  getCourses,
  getFeaturedCourses,
  getCourseDetails,
  createCourse,
  updateCourse,
  deleteCourse,
  submitCourseForApproval,
  getInstructorCourses,
} = require('../controllers/courseController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { instructorOnly, adminOrInstructor } = require('../middleware/roleMiddleware');

router.get('/featured', getFeaturedCourses);
router.get('/instructor/my-courses', protect, instructorOnly, getInstructorCourses);

router.route('/')
  .get(getCourses)
  .post(protect, instructorOnly, createCourse);

router.route('/:identifier')
  .get(optionalAuth, getCourseDetails);

router.route('/:id')
  .put(protect, adminOrInstructor, updateCourse)
  .delete(protect, adminOrInstructor, deleteCourse);

router.put('/:id/submit', protect, instructorOnly, submitCourseForApproval);

module.exports = router;
