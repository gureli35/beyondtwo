const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin User schema (simplified version)
const adminUserSchema = new mongoose.Schema({
  id: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: String,
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'editor'],
    default: 'editor'
  },
  permissions: [String],
  lastLogin: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// Role permissions mapping
const ROLE_PERMISSIONS = {
  editor: [
    'dashboard.view',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete'
  ],
  moderator: [
    'dashboard.view',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish'
  ],
  admin: [
    'dashboard.view',
    'admin.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.manage_roles',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish',
    'analytics.view',
    'system.settings',
    'permissions.manage'
  ],
  super_admin: [
    'dashboard.view',
    'admin.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.manage_roles',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish',
    'analytics.view',
    'system.settings',
    'permissions.manage'
  ]
};

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond2c');
    console.log('Connected to MongoDB');

    // Test users to create
    const testUsers = [
      {
        email: 'editor@beyond2c.org',
        password: 'editor123',
        displayName: 'Editör Kullanıcı',
        role: 'editor'
      },
      {
        email: 'moderator@beyond2c.org',
        password: 'moderator123',
        displayName: 'Moderatör Kullanıcı',
        role: 'moderator'
      },
      {
        email: 'admin@beyond2c.org',
        password: 'admin123',
        displayName: 'Admin Kullanıcı',
        role: 'admin'
      },
      {
        email: 'superadmin@beyond2c.org',
        password: 'superadmin123',
        displayName: 'Super Admin Kullanıcı',
        role: 'super_admin'
      }
    ];

    console.log('Creating test users...');

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await AdminUser.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const user = new AdminUser({
          id: new mongoose.Types.ObjectId().toString(),
          email: userData.email,
          password: hashedPassword,
          displayName: userData.displayName,
          role: userData.role,
          permissions: ROLE_PERMISSIONS[userData.role],
          lastLogin: new Date().toISOString(),
          isActive: true
        });

        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log('\n📋 Test Users Summary:');
    console.log('='.repeat(50));
    console.log('🔸 Editor: editor@beyond2c.org (password: editor123)');
    console.log('  - Can view/edit own blog posts only');
    console.log('🔸 Moderator: moderator@beyond2c.org (password: moderator123)');
    console.log('  - Can view/edit own blog posts + voices/gençlik sesleri');
    console.log('🔸 Admin: admin@beyond2c.org (password: admin123)');
    console.log('  - Full access + user role management');
    console.log('🔸 Super Admin: superadmin@beyond2c.org (password: superadmin123)');
    console.log('  - Complete system access');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUsers();
