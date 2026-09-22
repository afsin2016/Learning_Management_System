const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  reviewInstructor,
  getAllCourses,
  reviewCourse,
  getAllEnrollments,
  getAllReviews,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.put('/instructors/:id/approval', reviewInstructor);
router.get('/courses', getAllCourses);
router.put('/courses/:id/status', reviewCourse);
router.get('/enrollments', getAllEnrollments);
router.get('/reviews', getAllReviews);

module.exports = router;
