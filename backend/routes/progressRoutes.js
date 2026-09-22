const express = require('express');
const router = express.Router();
const {
  getProgress,
  toggleLessonComplete,
  setCurrentLesson,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:courseId', protect, getProgress);
router.post('/:courseId/lessons/:lessonId', protect, toggleLessonComplete);
router.put('/:courseId/current-lesson', protect, setCurrentLesson);

module.exports = router;
