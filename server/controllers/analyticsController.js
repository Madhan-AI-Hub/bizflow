const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const isStaff = req.user.role === 'STAFF';
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Dynamic match filter for Sales
    const saleMatch = { businessId };
    if (isStaff) {
      saleMatch.createdBy = userId;
    }

    // Total revenue
    const totalRevenue = await Sale.aggregate([
      { $match: saleMatch },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Today's revenue
    const todayRevenue = await Sale.aggregate([
      { $match: { ...saleMatch, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // This month's revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthRevenue = await Sale.aggregate([
      { $match: { ...saleMatch, createdAt: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Total sales count
    const totalSalesCount = await Sale.countDocuments(saleMatch);
    const todaySalesCount = await Sale.countDocuments({ ...saleMatch, createdAt: { $gte: today } });

    const revenue = totalRevenue[0]?.total || 0;

    // Staff only gets sales/revenue data, Admins get everything
    if (isStaff) {
      return res.status(200).json({
        success: true,
        data: {
          revenue: {
            total: revenue,
            today: todayRevenue[0]?.total || 0,
            thisMonth: monthRevenue[0]?.total || 0
          },
          counts: {
            sales: totalSalesCount,
            salesToday: todaySalesCount
          }
        }
      });
    }

    // Admin-only metrics (Expenses, Profit, Customer/Product counts)
    const totalExpenses = await Expense.aggregate([
      { $match: { businessId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayExpenses = await Expense.aggregate([
      { $match: { businessId, date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthExpenses = await Expense.aggregate([
      { $match: { businessId, date: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalCustomers = await Customer.countDocuments({ businessId });
    const totalProducts = await Product.countDocuments({ businessId });

    const expenses = totalExpenses[0]?.total || 0;
    const profit = revenue - expenses;

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: revenue,
          today: todayRevenue[0]?.total || 0,
          thisMonth: monthRevenue[0]?.total || 0
        },
        expenses: {
          total: expenses,
          today: todayExpenses[0]?.total || 0,
          thisMonth: monthExpenses[0]?.total || 0
        },
        profit: {
          total: profit,
          thisMonth: (monthRevenue[0]?.total || 0) - (monthExpenses[0]?.total || 0)
        },
        counts: {
          customers: totalCustomers,
          products: totalProducts,
          sales: totalSalesCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get revenue by period
// @route   GET /api/analytics/revenue
// @access  Private (Admin only)
exports.getRevenueByPeriod = async (req, res) => {
  try {
    const { period = 'daily', days = 7 } = req.query;
    const businessId = req.user.businessId;

    let groupFormat;
    let startDate = new Date();

    if (period === 'daily') {
      startDate.setDate(startDate.getDate() - parseInt(days));
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - parseInt(days));
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    } else if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - (parseInt(days) * 7));
      groupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
    }

    const revenueData = await Sale.aggregate([
      { $match: { businessId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top customers
// @route   GET /api/analytics/top-customers
// @access  Private (Admin only)
exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const businessId = req.user.businessId;

    const topCustomers = await Sale.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          totalSpent: { $sum: '$totalAmount' },
          totalPurchases: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: topCustomers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top products
// @route   GET /api/analytics/top-products
// @access  Private (Admin only)
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const businessId = req.user.businessId;

    const topProducts = await Sale.aggregate([
      { $match: { businessId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalRevenue: { $sum: '$items.subtotal' },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get expenses by category
// @route   GET /api/analytics/expenses-by-category
// @access  Private (Admin only)
exports.getExpensesByCategory = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    const expensesByCategory = await Expense.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: expensesByCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
