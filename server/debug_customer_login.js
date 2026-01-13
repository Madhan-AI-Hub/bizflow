require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const jwt = require('jsonwebtoken');

async function debugCustomerLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all customers
    const customers = await Customer.find({}).select('+password');
    console.log(`\n📊 Found ${customers.length} customer(s) in database\n`);

    if (customers.length === 0) {
      console.log('❌ No customers found! You need to create a customer first.');
      process.exit(0);
    }

    // Display each customer
    customers.forEach((customer, index) => {
      console.log(`Customer ${index + 1}:`);
      console.log(`  ID: ${customer._id}`);
      console.log(`  Name: ${customer.name}`);
      console.log(`  Email: ${customer.email || 'N/A'}`);
      console.log(`  Phone: ${customer.phone}`);
      console.log(`  Role: ${customer.role || 'UNDEFINED'}`);
      console.log(`  Has Password: ${customer.password ? 'YES' : 'NO'}`);
      console.log(`  BusinessId: ${customer.businessId}`);
      console.log('');
    });

    // Test token generation and verification
    const testCustomer = customers[0];
    console.log('🔐 Testing JWT token generation...');
    const token = jwt.sign({ id: testCustomer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log(`Token: ${token.substring(0, 50)}...`);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded ID: ${decoded.id}`);

    // Try to find customer with decoded ID
    const foundCustomer = await Customer.findById(decoded.id).select('-password');
    console.log('\n🔍 Customer found by token ID:');
    console.log(`  Name: ${foundCustomer.name}`);
    console.log(`  Role: ${foundCustomer.role || 'UNDEFINED'}`);
    console.log(`  Role Type: ${typeof foundCustomer.role}`);

    // Check if role exists
    if (!foundCustomer.role) {
      console.log('\n⚠️  WARNING: Customer has no role field!');
      console.log('This is the problem - updating customer with role...');
      
      foundCustomer.role = 'CUSTOMER';
      await foundCustomer.save();
      console.log('✅ Updated customer role to CUSTOMER');
    }

    console.log('\n✅ Debug complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugCustomerLogin();
