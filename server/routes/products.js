const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireStaffOrAdmin } = require('../middleware/rbac');

router.route('/')
  .post(protect, requireStaffOrAdmin, createProduct)
  .get(protect, getProducts);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, requireStaffOrAdmin, updateProduct)
  .delete(protect, requireStaffOrAdmin, deleteProduct);

module.exports = router;
