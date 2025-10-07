const express = require('express');
const router = express.Router();
const packageController = require('../../Controllers/service/packageController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

router.post('/packages',  packageController.createPackage);
 HEAD
//router.get('/packages', requireAuth, attachToken, packageController.getAllPackages);
router.get('/packages', packageController.getAllPackages, 8085f2c16e09b75c96dd063bb9dbdbc1c618168c);
router.get('/packages/:packageId', requireAuth, attachToken, packageController.getPackageById);
router.put('/packages/:packageId', requireAuth, attachToken, packageController.updatePackage);
router.delete('/packages/:packageId', requireAuth, attachToken, packageController.deletePackage);
router.get('/packages-by-category', requireAuth, attachToken, packageController.getPackagesByCategory);

module.exports = router;
