const express = require('express');
const router = express.Router();
const {
  addReview,
  getCourseReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addReview);

router.get('/course/:courseId', getCourseReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
