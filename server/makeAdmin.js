import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Script to promote a user to admin role
const makeAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get email from command line argument
        const email = process.argv[2];

        if (!email) {
            console.log('\n Please provide an email address');
            process.exit(1);
        }

        // Find and update the user
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log(`\nUser with email "${email}" not found`);
            console.log('Please make sure the user exists in the database.\n');
            process.exit(1);
        }

        console.log('\nUser successfully promoted to admin!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('User Details:');
        console.log(`  Name:     ${user.name}`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email:    ${user.email}`);
        console.log(`  Role:     ${user.role}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n IMPORTANT: The user must LOG OUT and LOG IN again');
        console.log('   for the admin role to take effect!\n');

        process.exit(0);
    } catch (error) {
        console.error('\nError:', error.message);
        process.exit(1);
    }
};

makeAdmin();
