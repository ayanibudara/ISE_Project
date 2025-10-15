const express = require('express');
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByPackage,
} = require('../../Controllers/Review/reviewController.js');

const { requireAuth, attachToken } = require('../../middleware/authMiddleware');

const router = express.Router();

// 🔒 Protected: Only logged-in users can add reviews
router.post('/add', requireAuth, attachToken, createReview);

// 🔒 Protected: Providers can view only reviews for their own packages
router.get('/',  getReviews);

// 🌐 Public: Anyone can view reviews for a specific package
router.get('/package/:packageId', getReviewsByPackage);

// 🌐 Public: Anyone can view a single review
router.get('/:id', getReviewById);

// 🔒 Protected: Only logged-in users can update or delete reviews
router.put('/:id', requireAuth, attachToken, updateReview);
router.delete('/:id', requireAuth, attachToken, deleteReview);

module.exports = router;
