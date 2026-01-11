const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

// All expense routes require admin privileges
router.route('/')
  .post(protect, requireAdmin, createExpense)
  .get(protect, requireAdmin, getExpenses);

router.route('/:id')
  .get(protect, requireAdmin, getExpenseById)
  .put(protect, requireAdmin, updateExpense)
  .delete(protect, requireAdmin, deleteExpense);

module.exports = router;
