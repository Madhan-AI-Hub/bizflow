const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Business = require('../models/Business');
const { generateToken } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user (Admin) with business
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, businessName, businessCategory } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate IDs for both to satisfy circular required fields
    const userId = new mongoose.Types.ObjectId();
    const businessId = new mongoose.Types.ObjectId();

    // Create business first with pre-generated ownerId
    const business = await Business.create({
      _id: businessId,
      name: businessName,
      category: businessCategory,
      ownerId: userId
    });

    // Create user with pre-generated businessId
    const user = await User.create({
      _id: userId,
      name,
      email,
      password,
      role: 'ADMIN',
      businessId: businessId
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login customer
// @route   POST /api/auth/customer-login
// @access  Public
exports.customerLogin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if (!password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password'
      });
    }

    // Check for customer
    const query = email ? { email } : { phone };
    const customer = await Customer.findOne(query).select('+password');
    
    if (!customer || !customer.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account not set up'
      });
    }

    // Check password
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(customer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: 'CUSTOMER',
          businessId: customer.businessId
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'CUSTOMER') {
      user = await Customer.findById(req.user.id).populate('businessId');
    } else {
      user = await User.findById(req.user.id).populate('businessId');
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Forgot Password - Reset and Email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // 1. Try to find in User (Admin/Staff)
    let user = await User.findOne({ email });
    let isCustomer = false;

    // 2. If not found, try Customer
    if (!user) {
      user = await Customer.findOne({ email });
      isCustomer = true;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with that email' });
    }

    // 3. Generate random 8-character password
    // Using simple random string for compatibility
    const newPassword = Math.random().toString(36).slice(-8);

    // 4. Hash and save
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    // 5. Send email
    const message = `You requested a password reset for your BizFlow account.

Your NEW temporary password is:
${newPassword}

Please log in and change your password immediately.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'BizFlow Password Reset',
        message
      });

      res.status(200).json({ success: true, message: 'Password reset successful. Check your email.' });
    } catch (err) {
      console.error(err);
      // Don't reveal exact error to client, but log it
      user.password = undefined; // Try to revert? (Actually DB is already saved, so we just inform user email failed but password changed)
      return res.status(500).json({ success: false, message: 'Password changed, but email could not be sent. Please contact admin.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
