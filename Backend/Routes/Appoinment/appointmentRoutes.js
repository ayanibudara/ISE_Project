const express = require('express');
const router = express.Router();
const appointmentController = require('../../Controllers/Appoinment/appointmentController.js');
const { requireAuth, restrictTo, attachToken } = require('../../middleware/authMiddleware');

// Create a new appointment (any authenticated user)
router.post('/add', requireAuth, attachToken, appointmentController.createAppointment);

// 🆕 NEW: Get pending guide requests (MUST be before '/:id')
router.get('/pending', appointmentController.getPendingAppointments);



// Get all appointments (admin only)
router.get('/', appointmentController.getAllAppointments);

// Get logged-in user's appointments
router.get('/my', requireAuth, attachToken, appointmentController.getUserAppointments);

// Get a single appointment (owner or admin)
router.get('/:id', requireAuth, attachToken, appointmentController.getAppointmentById);


// 🆕 NEW: Update appointment (for guide assignment)
router.patch('/:id', appointmentController.updateAppointmentStatus);


// Update an appointment (owner or admin)
router.put('/:id', requireAuth, attachToken, appointmentController.updateAppointment);

// Delete an appointment (owner or admin)
router.delete('/:id', requireAuth, attachToken, appointmentController.deleteAppointment);

module.exports = router;
