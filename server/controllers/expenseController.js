const Expense = require('../models/Expense');

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private (Admin only)
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description, date, notes } = req.body;

    const expense = await Expense.create({
      category,
      amount,
      description,
      date: date || Date.now(),
      notes,
      businessId: req.user.businessId,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private (Admin only)
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let query = { businessId: req.user.businessId };
    
    // Add date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private (Admin only)
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    }).populate('createdBy', 'name');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (Admin only)
exports.updateExpense = async (req, res) => {
  try {
    const { category, amount, description, date, notes } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update fields
    if (category) expense.category = category;
    if (amount !== undefined) expense.amount = amount;
    if (description) expense.description = description;
    if (date) expense.date = date;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin only)
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
