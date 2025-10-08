const express = require('express');
const router = express.Router();
const guideController = require('../../Controllers/Guide/guideController.js');
router.post('/', guideController.createGuide);
router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);
router.put('/:id', guideController.updateGuide);
router.delete('/:id', guideController.deleteGuide);

// Special Routes
router.get('/:id/availability', guideController.getAvailability);
router.post('/:id/availability', guideController.addAvailability);
router.post('/:id/tours', guideController.addUpcomingTour);
router.delete('/tour/:tourId', guideController.removeUpcomingTour);

module.exports = router;
