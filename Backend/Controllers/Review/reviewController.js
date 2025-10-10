const Review = require('../../Models/Review/reviewModel.js');
const Package = require('../../Models/Services/packageModel.js'); // make sure this path matches your structure

// @desc Create new review
// @route POST /api/reviews/add
exports.createReview = async (req, res) => {
  try {
    const { message, rating, packageId } = req.body;

    if (!message || !rating || !packageId) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Use logged-in user's name (if available)
    const userName = req.user ? req.user.firstName || req.user.name || 'Anonymous' : 'Anonymous';

    const review = await Review.create({
      userName,
      message,
      rating,
      packageId,
    });

    res.status(201).json({
      message: 'Review added successfully!',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reviews for the logged-in provider’s packages
// @route GET /api/reviews
exports.getReviews = async (req, res) => {
  try {
    // Find packages that belong to this provider
    const providerId = req.user.id;
    const providerPackages = await Package.find({ providerId }).select('_id');

    if (!providerPackages.length) {
      return res.status(404).json({ message: 'No packages found for this provider.' });
    }

    const packageIds = providerPackages.map(pkg => pkg._id);

    // Get all reviews linked to those packages
    const reviews = await Review.find({ packageId: { $in: packageIds } })
      .populate('packageId', 'name category price')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get reviews for a specific package
// @route GET /api/reviews/package/:packageId
exports.getReviewsByPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await Review.find({ packageId })
      .populate('packageId', 'name category price')
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this package.' });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other CRUD routes remain unchanged...
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('packageId', 'name category price');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('packageId', 'name category price');
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review updated successfully!', review: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
