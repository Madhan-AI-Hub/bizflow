require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const updateAdminEmail = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
      console.log('❌ No ADMIN user found!');
      process.exit(1);
    }

    const oldEmail = admin.email;
    admin.email = 'madhanac0711@gmail.com';
    await admin.save();

    console.log(`✅ Admin email updated from ${oldEmail} to madhanac0711@gmail.com`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdminEmail();
