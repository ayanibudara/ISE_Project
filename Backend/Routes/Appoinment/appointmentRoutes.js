const express = require('express');
const router = express.Router();
const appointmentController = require('../../Controllers/Appoinment/appointmentController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

router.post('/add',appointmentController.createAppointment);
router.get('/', appointmentController.getAllAppointments);
router.get('/my', requireAuth, attachToken, appointmentController.getUserAppointments);
router.get('/:id', requireAuth, attachToken, appointmentController.getAppointmentById);
router.put('/:id', requireAuth, attachToken, appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.get('/all', appointmentController.getAllAppointments);


module.exports = router;
