const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedDB = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if an admin already exists
        const userExists = await User.findOne({ email: 'admin@school.com' });
        if (userExists) {
            console.log('Admin user already exists.');
            process.exit();
        }

        // Create a new Admin user
        const user = new User({
            username: 'Principal Sharma',
            email: 'admin@school.com',
            password: 'password123', // The User model will automatically hash this
            role: 'Admin',
            organizationName: 'E-Vidyalaya High'
        });

        await user.save();
        console.log('Success! Admin user created.');
        console.log('Email: admin@school.com');
        console.log('Password: password123');
        
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();