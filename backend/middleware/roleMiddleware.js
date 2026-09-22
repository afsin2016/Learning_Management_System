const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

const adminOnly = authorize('admin');
const instructorOnly = authorize('instructor');
const studentOnly = authorize('student');
const adminOrInstructor = authorize('admin', 'instructor');

module.exports = {
  authorize,
  adminOnly,
  instructorOnly,
  studentOnly,
  adminOrInstructor,
};
