const express = require('express');
const router = express.Router();
const { register, login, customerLogin, getProfile, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
  body('businessCategory').trim().notEmpty().withMessage('Business category is required'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/customer-login', customerLogin);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);

module.exports = router;
