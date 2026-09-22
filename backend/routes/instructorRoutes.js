const express = require('express');
const router = express.Router();
const {
  getInstructorStats,
  getEnrolledStudents,
  getInstructorReviews,
} = require('../controllers/instructorController');
const { protect } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');

router.use(protect, instructorOnly);

router.get('/stats', getInstructorStats);
router.get('/students', getEnrolledStudents);
router.get('/reviews', getInstructorReviews);

module.exports = router;
