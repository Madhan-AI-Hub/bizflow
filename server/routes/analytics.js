const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueByPeriod,
  getTopCustomers,
  getTopProducts,
  getExpensesByCategory
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireStaffOrAdmin } = require('../middleware/rbac');

// Dashboard analytics available to both staff and admin
router.get('/dashboard', protect, requireStaffOrAdmin, getDashboardStats);
router.get('/revenue', protect, requireAdmin, getRevenueByPeriod);
router.get('/top-customers', protect, requireAdmin, getTopCustomers);
router.get('/top-products', protect, requireAdmin, getTopProducts);
router.get('/expenses-by-category', protect, requireAdmin, getExpensesByCategory);

module.exports = router;
