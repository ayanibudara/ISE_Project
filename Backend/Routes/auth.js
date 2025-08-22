const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const upload = require('../config/multer');

// Validation rules for registration
const registerValidation = [
  body('firstName')
    .not().isEmpty().withMessage('First name is required')
    .trim().isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 30 characters'),
  
  body('lastName')
    .not().isEmpty().withMessage('Last name is required')
    .trim().isLength({ min: 2, max: 30 }).withMessage('Last name must be between 2 and 30 characters'),
  
  body('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('mobile')
    .not().isEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Please provide a valid mobile number'),
  
  body('password')
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .not().isEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  body('role')
    .not().isEmpty().withMessage('Role is required')
    .isIn(['Guide', 'Tourist', 'ServiceProvider']).withMessage('Role must be Guide, Tourist, or ServiceProvider')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .not().isEmpty().withMessage('Password is required')
];

// Register route - multer first, then custom validation
router.post('/register', upload.single('profilePicture'), authController.register);

// Login route
router.post('/login', loginValidation, authController.login);

// Get user profile route
router.get('/profile', authController.getProfile);

// Update profile route (with optional profile picture upload)
router.put('/profile', upload.single('profilePicture'), authController.updateProfile);

// Delete profile route
router.delete('/profile', authController.deleteProfile);

// Upload profile picture route
router.post('/upload-profile-picture', upload.single('profilePicture'), authController.uploadProfilePicture);

// Logout route
router.post('/logout', authController.logout);

module.exports = router;
