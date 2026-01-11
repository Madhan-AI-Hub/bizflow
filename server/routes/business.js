const express = require('express');
const router = express.Router();
const { getBusinessProfile, updateBusinessProfile } = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.route('/')
  .get(protect, getBusinessProfile)
  .put(protect, requireAdmin, updateBusinessProfile);

module.exports = router;
