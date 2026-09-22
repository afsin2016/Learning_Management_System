const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length >= 2, 'Quiz question must have at least 2 options'],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
    passingPercentage: {
      type: Number,
      default: 70,
      min: 1,
      max: 100,
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
