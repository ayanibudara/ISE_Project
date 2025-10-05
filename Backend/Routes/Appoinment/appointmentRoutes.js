const express = require('express');
const router = express.Router();
const appointmentController = require('../../Controllers/Appoinment/appointmentController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

router.post('/add',appointmentController.createAppointment);
router.get('/', requireAuth, attachToken, appointmentController.getAllAppointments);
router.get('/my', requireAuth, attachToken, appointmentController.getUserAppointments);
router.get('/:id', requireAuth, attachToken, appointmentController.getAppointmentById);
router.put('/:id', requireAuth, attachToken, appointmentController.updateAppointment);
router.delete('/:id', requireAuth, attachToken, appointmentController.deleteAppointment);


module.exports = router;
