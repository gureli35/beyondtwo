import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePicture: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500
    },
    website: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator', 'editor'],
      default: 'user'
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret: Record<string, any>) {
        if (ret.password) {
          delete ret.password;
        }
        return ret;
      }
    }
  }
);

// Index'ler
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ isAdmin: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
