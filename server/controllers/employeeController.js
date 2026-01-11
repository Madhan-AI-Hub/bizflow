const User = require('../models/User');

// @desc    Create new employee (staff user)
// @route   POST /api/employees
// @access  Private (Admin only)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const employee = await User.create({
      name,
      email,
      password,
      role: 'STAFF',
      businessId: req.user.businessId
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin only)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      businessId: req.user.businessId,
      role: 'STAFF'
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private (Admin only)
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
      role: 'STAFF'
    }).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin only)
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    const employee = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
      role: 'STAFF'
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email;

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
      role: 'STAFF'
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
