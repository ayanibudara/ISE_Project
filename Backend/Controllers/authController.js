const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'User already exists with this email' : 'User already exists with this mobile number' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password,
      role
    });

    // If profile picture was uploaded, save the path
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      console.log('Profile picture set:', user.profilePicture);
    }

    await user.save();
    console.log('User saved successfully with profilePicture:', user.profilePicture);

    // Store user info in session (auto-login after registration)
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profilePicture: user.profilePicture
    };

    console.log('Session user data:', req.session.user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `A user with this ${field} already exists`
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profilePicture: user.profilePicture
    };

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err.message });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const updateData = { ...req.body };
    
    // If a new profile picture was uploaded, add it to update data
    if (req.file) {
      // Delete old profile picture if it exists
      const user = await User.findById(userId);
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(user.profilePicture));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Remove password from update if it's empty
    if (!updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update session data
    req.session.user = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture
    };

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Get user to delete profile picture if it exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile picture file if it exists
    if (user.profilePicture) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(user.profilePicture));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: 'Error destroying session' });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: 'Profile deleted successfully' });
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
