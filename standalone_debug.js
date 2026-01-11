const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  businessId: mongoose.Schema.Types.ObjectId
});

const CustomerSchema = new mongoose.Schema({
  name: String,
  role: String
});

const run = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const User = mongoose.model('User', UserSchema);
    const Customer = mongoose.model('Customer', CustomerSchema);

    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(u => console.log(`${u.name} | ${u.email} | Role: ${u.role} | Business: ${u.businessId}`));

    const customers = await Customer.find({});
    console.log('--- CUSTOMERS ---');
    customers.forEach(c => console.log(`${c.name} | Role: ${c.role}`));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

run();
