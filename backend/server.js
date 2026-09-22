const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'Learning Management System REST API',
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/curriculum', require('./routes/curriculumRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LMS Backend Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
