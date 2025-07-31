const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: String,
  lastName: String,
  username: String,
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'editor'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);

async function checkAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/beyond2c');
    console.log('Connected to MongoDB');

    // Admin kullanıcılarını ara
    const admins = await User.find({ 
      $or: [
        { isAdmin: true },
        { role: 'admin' },
        { email: { $regex: /admin/i } }
      ]
    }).select('+password');
    
    console.log('Found admin users:');
    admins.forEach(admin => {
      console.log({
        _id: admin._id,
        email: admin.email,
        username: admin.username,
        isAdmin: admin.isAdmin,
        role: admin.role,
        isActive: admin.isActive,
        isVerified: admin.isVerified,
        hasPassword: !!admin.password
      });
    });

    // Tüm kullanıcıları listele
    const allUsers = await User.find({}).limit(10);
    console.log('\nAll users (first 10):');
    allUsers.forEach(user => {
      console.log({
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role,
        isActive: user.isActive
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAdmin();
