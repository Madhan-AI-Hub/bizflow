require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const expenseRoutes = require('./routes/expenses');
const employeeRoutes = require('./routes/employees');
const analyticsRoutes = require('./routes/analytics');

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '✅ BizFlow API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      business: '/api/business',
      customers: '/api/customers',
      products: '/api/products',
      sales: '/api/sales',
      expenses: '/api/expenses',
      employees: '/api/employees',
      analytics: '/api/analytics'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler (must be last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
