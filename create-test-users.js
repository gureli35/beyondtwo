const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: String,
  lastName: String,
  username: String,
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'editor', 'moderator'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/beyond2c');
    console.log('Connected to MongoDB');

    const testUsers = [
      {
        email: 'editor@beyond2c.org',
        password: await bcrypt.hash('editor123', 12),
        firstName: 'Editor',
        lastName: 'User',
        username: 'editor',
        role: 'editor',
        isActive: true,
        isVerified: true
      },
      {
        email: 'moderator@beyond2c.org',
        password: await bcrypt.hash('moderator123', 12),
        firstName: 'Moderator',
        lastName: 'User',
        username: 'moderator',
        role: 'moderator',
        isActive: true,
        isVerified: true
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email} with role: ${userData.role}`);
    }

    console.log('\nTest users created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@beyond2c.org / admin123');
    console.log('Moderator: moderator@beyond2c.org / moderator123');
    console.log('Editor: editor@beyond2c.org / editor123');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createTestUsers();
