const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Create or update quiz for a lesson
// @route   POST /api/quizzes
// @access  Private/Instructor or Admin
exports.saveQuiz = async (req, res, next) => {
  try {
    const {
      quizId,
      title,
      courseId,
      sectionId,
      lessonId,
      passingPercentage = 70,
      timeLimitMinutes = 15,
      questions,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let quiz;
    if (quizId) {
      quiz = await Quiz.findByIdAndUpdate(
        quizId,
        {
          title,
          passingPercentage,
          timeLimitMinutes,
          questions,
        },
        { new: true }
      );
    } else {
      quiz = await Quiz.create({
        title,
        course: courseId,
        section: sectionId,
        passingPercentage,
        timeLimitMinutes,
        questions,
      });

      if (lessonId) {
        await Lesson.findByIdAndUpdate(lessonId, { quiz: quiz._id, type: 'quiz' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Quiz saved successfully',
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz details
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    const isInstructorOrAdmin =
      req.user.role === 'admin' ||
      (course && course.instructor.toString() === req.user.id);

    // If student, strip correctAnswerIndex and explanation
    if (!isInstructorOrAdmin) {
      const sanitizedQuestions = quiz.questions.map((q, idx) => ({
        _id: q._id,
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
      }));

      return res.json({
        success: true,
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          course: quiz.course,
          passingPercentage: quiz.passingPercentage,
          timeLimitMinutes: quiz.timeLimitMinutes,
          questions: sanitizedQuestions,
        },
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and auto-grade
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of { questionIndex, selectedOption }
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    let totalScore = 0;
    let maxScore = 0;

    const evaluatedAnswers = quiz.questions.map((question, index) => {
      const studentAnswer = (answers || []).find((a) => a.questionIndex === index);
      const selectedOption = studentAnswer ? studentAnswer.selectedOption : -1;
      const isCorrect = selectedOption === question.correctAnswerIndex;

      maxScore += question.marks || 1;
      if (isCorrect) {
        correctCount += 1;
        totalScore += question.marks || 1;
      }

      return {
        questionIndex: index,
        questionText: question.questionText,
        options: question.options,
        selectedOption,
        correctAnswerIndex: question.correctAnswerIndex,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const percentage = Math.round((totalScore / (maxScore || 1)) * 100);
    const passed = percentage >= quiz.passingPercentage;

    const attempt = await QuizAttempt.create({
      student: req.user.id,
      quiz: quiz._id,
      course: quiz.course,
      answers: evaluatedAnswers.map((a) => ({
        questionIndex: a.questionIndex,
        selectedOption: a.selectedOption,
        isCorrect: a.isCorrect,
      })),
      totalQuestions: quiz.questions.length,
      correctCount,
      score: totalScore,
      percentage,
      passed,
    });

    res.json({
      success: true,
      result: {
        attemptId: attempt._id,
        score: totalScore,
        maxScore,
        correctCount,
        totalQuestions: quiz.questions.length,
        percentage,
        passingPercentage: quiz.passingPercentage,
        passed,
        evaluatedAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's previous attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      student: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};
