import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Script to list all users in the database
const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const users = await User.find().select('name username email role');

        if (users.length === 0) {
            console.log('❌ No users found in the database.');
            console.log('Please create a user account first by signing up at http://localhost:3000/signup\n');
            process.exit(0);
        }

        console.log(`Found ${users.length} user(s):\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (@${user.username})`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role:  ${user.role}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });

        console.log('\nTo make a user admin, run:');
        console.log('node makeAdmin.js <email>\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listUsers();
