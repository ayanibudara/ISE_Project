const express = require('express');
const router = express.Router();
const packageController = require('../../Controllers/service/packageController.js');

router.post('/packages', packageController.createPackage);
router.get('/packages', packageController.getAllPackages);
router.get('/packages/:packageId', packageController.getPackageById);
router.put('/packages/:packageId', packageController.updatePackage);
router.delete('/packages/:packageId', packageController.deletePackage);
router.get('/packages-by-category', packageController.getPackagesByCategory);

module.exports = router;
