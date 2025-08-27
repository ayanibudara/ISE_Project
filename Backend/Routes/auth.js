const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../config/multer');

// Register route - multer for profile picture upload
router.post('/register', upload.single('profilePicture'), authController.register);

// Login route
router.post('/login', authController.login);

// Get user profile route
router.get('/profile', authController.getProfile);

// Update profile route (with optional profile picture upload)
router.put('/profile', upload.single('profilePicture'), authController.updateProfile);

// Delete profile route
router.delete('/profile', authController.deleteProfile);

// Logout route
router.post('/logout', authController.logout);

module.exports = router;
