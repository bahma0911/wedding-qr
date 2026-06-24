const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load backend .env if present
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function run() {
  try {
    await connectDB();

    const email = process.env.SEED_ADMIN_EMAIL || 'bahma0911@gmail.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'bahma0911';
    const name = process.env.SEED_ADMIN_NAME || 'bahma';

    if (!email || !password) {
      console.error('Missing admin email or password. Set SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD or edit this script.');
      process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      user.name = name;
      user.password = hashed;
      user.role = 'admin';
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      user = await User.create({ name, email, password: hashed, role: 'admin' });
      console.log('Created new admin user:', email);
    }

    console.log('Done. You can now log in with the admin account.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message || err);
    process.exit(1);
  }
}

run();
