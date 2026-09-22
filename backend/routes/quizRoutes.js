const express = require('express');
const router = express.Router();
const {
  saveQuiz,
  getQuiz,
  submitQuiz,
  getQuizAttempts,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { adminOrInstructor, studentOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, adminOrInstructor, saveQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, studentOnly, submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

module.exports = router;
