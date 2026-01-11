const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

// All employee routes require admin privileges
router.route('/')
  .post(protect, requireAdmin, createEmployee)
  .get(protect, requireAdmin, getEmployees);

router.route('/:id')
  .get(protect, requireAdmin, getEmployeeById)
  .put(protect, requireAdmin, updateEmployee)
  .delete(protect, requireAdmin, deleteEmployee);

module.exports = router;
