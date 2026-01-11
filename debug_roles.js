const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./server/models/User');
        const users = await User.find({}).select('name email role businessId');
        console.log('Users:', JSON.stringify(users, null, 2));
        
        const Customer = require('./server/models/Customer');
        const customers = await Customer.find({}).select('name role');
        console.log('Customers:', JSON.stringify(customers, null, 2));

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUsers();
