const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private (Admin/Staff)
exports.createSale = async (req, res) => {
  console.log('--- CREATE SALE START ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('User:', req.user?._id, '| Business:', req.user?.businessId);
  try {
    const { customerId, items, paymentMethod, amountPaid, notes } = req.body;

    // Verify customer exists
    const customer = await Customer.findOne({
      _id: customerId,
      businessId: req.user.businessId
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Process items and calculate total
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        businessId: req.user.businessId
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      const subtotal = item.quantity * item.price;
      totalAmount += subtotal;

      processedItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal
      });

      // Update stock if applicable
      if (product.stockQuantity >= item.quantity) {
        product.stockQuantity -= item.quantity;
        await product.save();
      }
    }

    const paid = parseFloat(amountPaid) || 0;
    const balanceAmount = totalAmount - paid;
    let paymentStatus = 'PENDING';
    
    if (paid >= totalAmount) {
      paymentStatus = 'PAID';
    } else if (paid > 0) {
      paymentStatus = 'PARTIAL';
    }

    const sale = await Sale.create({
      customerId,
      customerName: customer.name,
      items: processedItems,
      totalAmount,
      amountPaid: paid,
      balanceAmount,
      paymentStatus,
      paymentMethod,
      notes,
      businessId: req.user.businessId,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    
    let query = { businessId: req.user.businessId };
    
    // Add date filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Add customer filter
    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user._id;
    } else if (customerId) {
      query.customerId = customerId;
    }

    const sales = await Sale.find(query)
      .populate('customerId', 'name phone')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    })
      .populate('customerId', 'name phone email')
      .populate('createdBy', 'name');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private (Admin only)
exports.updateSale = async (req, res) => {
  try {
    const { paymentMethod, amountPaid, notes } = req.body;

    const sale = await Sale.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Update fields
    if (paymentMethod) sale.paymentMethod = paymentMethod;
    if (notes !== undefined) sale.notes = notes;

    if (amountPaid !== undefined) {
      const additionalPaid = parseFloat(amountPaid) || 0;
      sale.amountPaid += additionalPaid;
      sale.balanceAmount = sale.totalAmount - sale.amountPaid;
      
      if (sale.amountPaid >= sale.totalAmount) {
        sale.paymentStatus = 'PAID';
        sale.balanceAmount = 0; // Prevent negative balance if overpaid
      } else if (sale.amountPaid > 0) {
        sale.paymentStatus = 'PARTIAL';
      } else {
        sale.paymentStatus = 'PENDING';
      }
    }

    await sale.save();

    res.status(200).json({
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private (Admin only)
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    await sale.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
