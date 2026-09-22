const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide lesson title'],
      trim: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['video', 'article', 'quiz'],
      default: 'video',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '10:00',
    },
    content: {
      type: String,
      default: '',
    },
    resources: [resourceSchema],
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lesson', lessonSchema);
