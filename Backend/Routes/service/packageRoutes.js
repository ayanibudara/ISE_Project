const express = require('express');
const router = express.Router();
const packageController = require('../../Controllers/service/packageController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

router.post('/packages', packageController.createPackage);
// requireAuth, attachToken,
//router.get('/packages', requireAuth, attachToken, packageController.getAllPackages);
router.get('/packages/provider/:providerId', packageController.getPackagesByProvider);
router.get('/packages', packageController.getAllPackages);
router.get('/packages/:packageId', packageController.getPackageById);
router.put('/packages/:packageId', requireAuth, attachToken, packageController.updatePackage);
router.delete('/packages/:packageId', requireAuth, attachToken, packageController.deletePackage);
router.get('/packages-by-category', requireAuth, attachToken, packageController.getPackagesByCategory);

module.exports = router;


