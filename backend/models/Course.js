const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
      maxlength: [160, 'Title cannot be more than 160 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [250, 'Subtitle cannot be more than 250 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide course price'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert', 'All Levels'],
      default: 'All Levels',
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: String,
      default: '5 hours',
    },
    requirements: {
      type: [String],
      default: [],
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Course', courseSchema);
