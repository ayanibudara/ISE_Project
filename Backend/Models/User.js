const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[+]?[0-9]{10,15}$/, 'Please enter a valid mobile number (10-15 digits)']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['Guide', 'Tourist', 'ServiceProvider', 'Admin'],
      required: [true, 'User role is required']
    },
    profilePicture: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Additional fields specific to roles can be added here
    // For Guide
    specialization: {
      type: String,
      default: ''
    },
    experience: {
      type: Number,
      default: 0
    },
    // For ServiceProvider
    businessName: {
      type: String,
      default: ''
    },
    serviceType: {
      type: String,
      default: ''
    },
    // For Tourist
    nationality: {
      type: String,
      default: ''
    },
    preferences: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return public user data (without password)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
