const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    pricePaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
