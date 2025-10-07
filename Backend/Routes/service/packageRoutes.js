const express = require('express');
const router = express.Router();
const packageController = require('../../Controllers/service/packageController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

router.post('/packages',  packageController.createPackage);
router.get('/packages', packageController.getAllPackages);
router.get('/packages/:packageId', requireAuth, attachToken, packageController.getPackageById);
router.put('/packages/:packageId', requireAuth, attachToken, packageController.updatePackage);
router.delete('/packages/:packageId', requireAuth, attachToken, packageController.deletePackage);
router.get('/packages-by-category', requireAuth, attachToken, packageController.getPackagesByCategory);

module.exports = router;
