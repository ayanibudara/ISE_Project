const express = require('express');
const router = express.Router();
const guideController = require('../../Controllers/Guide/guideController.js');

router.post('/guides', guideController.createGuide);
router.get('/guides', guideController.getAllGuides);
router.post('/guides/:guideId/availability', guideController.setAvailability);
router.post('/guides/:guideId/tours', guideController.addTour);
router.get('/guides/:guideId/upcoming-tours', guideController.getUpcomingTours);

module.exports = router;
