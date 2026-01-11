const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale
} = require('../controllers/saleController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireStaffOrAdmin } = require('../middleware/rbac');

router.route('/')
  .post(protect, requireStaffOrAdmin, createSale)
  .get(protect, getSales);

router.route('/:id')
  .get(protect, getSaleById)
  .put(protect, requireStaffOrAdmin, updateSale)
  .delete(protect, requireAdmin, deleteSale);

module.exports = router;
