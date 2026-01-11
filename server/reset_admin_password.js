require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find the first admin
    const admin = await User.findOne({ role: 'ADMIN' });

    if (!admin) {
      console.log('❌ No ADMIN user found!');
      process.exit(1);
    }

    console.log(`Found Admin: ${admin.email}`);

    // Set new password
    admin.password = '123456';
    await admin.save();

    console.log('✅ Password successfully reset to: 123456');
    console.log('You can now login with:');
    console.log(`Email: ${admin.email}`);
    console.log('Password: 123456');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdmin();
