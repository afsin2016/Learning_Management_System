const Certificate = require('../models/Certificate');

// @desc    Get all certificates earned by current student
// @route   GET /api/certificates/my-certificates
// @access  Private/Student
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate('course', 'title thumbnail duration')
      .populate('instructor', 'name avatar')
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by unique ID (Public Verification)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('student', 'name avatar')
      .populate('course', 'title subtitle thumbnail duration')
      .populate('instructor', 'name avatar headline');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Certificate not found. This credential could not be verified.',
      });
    }

    res.json({
      success: true,
      isValid: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};
