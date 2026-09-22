const express = require('express');
const router = express.Router();
const {
  getCurriculum,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson,
  getLessonContent,
} = require('../controllers/curriculumController');
const { protect } = require('../middleware/authMiddleware');
const { adminOrInstructor } = require('../middleware/roleMiddleware');

router.get('/course/:courseId', getCurriculum);

// Section endpoints
router.post('/sections', protect, adminOrInstructor, addSection);
router.route('/sections/:id')
  .put(protect, adminOrInstructor, updateSection)
  .delete(protect, adminOrInstructor, deleteSection);

// Lesson endpoints
router.post('/lessons', protect, adminOrInstructor, addLesson);
router.route('/lessons/:id')
  .get(protect, getLessonContent)
  .put(protect, adminOrInstructor, updateLesson)
  .delete(protect, adminOrInstructor, deleteLesson);

module.exports = router;
