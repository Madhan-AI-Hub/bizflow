const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private (Admin/Staff)
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, notes, password } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      notes,
      password,
      businessId: req.user.businessId
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A customer with this phone number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { businessId: req.user.businessId };
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });

    // Calculate total spending for each customer
    const customersWithSpending = await Promise.all(
      customers.map(async (customer) => {
        const salesTotal = await Sale.aggregate([
          { $match: { customerId: customer._id } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
          ...customer.toObject(),
          totalSpending: salesTotal.length > 0 ? salesTotal[0].total : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customersWithSpending.length,
      data: customersWithSpending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get total spending
    const salesTotal = await Sale.aggregate([
      { $match: { customerId: customer._id } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get recent sales
    const recentSales = await Sale.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        ...customer.toObject(),
        totalSpending: salesTotal.length > 0 ? salesTotal[0].total : 0,
        recentSales
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (Admin only)
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, notes, password } = req.body;

    const customer = await Customer.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update fields
    if (name) customer.name = name;
    if (email !== undefined) customer.email = email;
    if (phone) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (notes !== undefined) customer.notes = notes;
    if (password) customer.password = password;

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin only)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
