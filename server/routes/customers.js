const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireStaffOrAdmin } = require('../middleware/rbac');

router.route('/')
  .post(protect, requireStaffOrAdmin, createCustomer)
  .get(protect, getCustomers);

router.route('/:id')
  .get(protect, getCustomerById)
  .put(protect, requireStaffOrAdmin, updateCustomer)
  .delete(protect, requireAdmin, deleteCustomer);

module.exports = router;
