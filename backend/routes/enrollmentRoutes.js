const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  checkEnrollment,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);
router.get('/check/:courseId', protect, checkEnrollment);

module.exports = router;
