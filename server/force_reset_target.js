require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const forceReset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const targetEmail = 'madhanac0711@gmail.com';
    let user = await User.findOne({ email: targetEmail });

    if (user) {
      console.log(`✅ Found specific user: ${user.email} (${user.role})`);
    } else {
      console.log(`⚠️ User ${targetEmail} not found. Falling back to first ADMIN.`);
      user = await User.findOne({ role: 'ADMIN' });
    }

    if (!user) {
      console.log('❌ No user found to reset!');
      process.exit(1);
    }

    user.password = '123456';
    await user.save();

    console.log('------------------------------------------------');
    console.log('🎉 PASSWORD RESET SUCCESSFUL');
    console.log('------------------------------------------------');
    console.log('Login Email:    ' + user.email);
    console.log('Login Password: 123456');
    console.log('------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

forceReset();
