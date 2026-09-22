const express = require('express');
const router = express.Router();
const {
  getMyCertificates,
  verifyCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-certificates', protect, getMyCertificates);
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;
