const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const createAdminUser = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Learning_Management_System';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    // Read custom CLI arguments or default
    const email = process.argv[2] || 'admin@lms.com';
    const password = process.argv[3] || 'Password123!';
    const name = process.argv[4] || 'Master Administrator';

    console.log(`Checking if admin user exists (${email})...`);
    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`Admin user '${email}' already exists. Updating password and ensuring admin role...`);
      admin.password = password;
      admin.role = 'admin';
      admin.status = 'active';
      await admin.save();
    } else {
      console.log(`Creating new admin user: ${email}...`);
      admin = await User.create({
        name,
        email,
        password,
        role: 'admin',
        headline: 'Platform Master Administrator',
        bio: 'Super administrator managing courses, users, and platform governance.',
        status: 'active',
      });
    }

    const token = generateToken(admin._id);

    console.log('========================================================');
    console.log('ADMIN USER READY FOR AUTHENTICATION:');
    console.log('--------------------------------------------------------');
    console.log(`Name:     ${admin.name}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${admin.role}`);
    console.log(`Status:   ${admin.status}`);
    console.log(`User ID:  ${admin._id}`);
    console.log('--------------------------------------------------------');
    console.log(`Sample JWT Token: ${token}`);
    console.log('========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
