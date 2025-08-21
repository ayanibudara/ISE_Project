const { body } = require('express-validator');

exports.registerValidation = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 2 and 30 characters'),
  
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('Last name is required')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be between 2 and 30 characters'),
  
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .not()
    .isEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  body('role')
    .not()
    .isEmpty()
    .withMessage('Role is required')
    .isIn(['Guide', 'Tourist', 'ServiceProvider'])
    .withMessage('Role must be Guide, Tourist, or ServiceProvider')
];

exports.loginValidation = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
];
