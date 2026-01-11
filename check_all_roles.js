const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
    const Customer = mongoose.model('Customer', new mongoose.Schema({ name: String, role: String, phone: String }));

    const users = await User.find({});
    console.log('=== ALL USERS ===');
    users.forEach(u => {
      console.log(`Node User: ${u.name} | Email: ${u.email} | Role: ${u.role} | Type: ${typeof u.role}`);
    });

    const customers = await Customer.find({});
    console.log('=== ALL CUSTOMERS ===');
    customers.forEach(c => {
      console.log(`Node Customer: ${c.name} | Phone: ${c.phone} | Role: ${c.role} | Type: ${typeof c.role}`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

run();
