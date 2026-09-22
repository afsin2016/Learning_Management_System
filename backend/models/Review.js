const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [1000, 'Review cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ student: 1, course: 1 }, { unique: true });

// Static method to calculate and update course average rating
reviewSchema.statics.calculateAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        numReviews: { $sum: 1 },
        rating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        rating: Math.round(stats[0].rating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        rating: 0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating course average rating:', err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.course);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.course);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
