const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- DB CHECK ---');
        
        const userSchema = new mongoose.Schema({ email: String, role: String });
        const User = mongoose.model('User', userSchema);
        
        const customerSchema = new mongoose.Schema({ email: String, phone: String, role: String });
        const Customer = mongoose.model('Customer', customerSchema);
        
        const users = await User.find({});
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`User: ${u.email} | Role: ${u.role}`));
        
        const customers = await Customer.find({});
        console.log('Customers found:', customers.length);
        customers.forEach(c => console.log(`Customer: ${c.email || c.phone} | Role: ${c.role}`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
