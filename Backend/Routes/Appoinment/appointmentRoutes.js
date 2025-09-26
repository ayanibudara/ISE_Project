const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../../Controllers/Appoinment/appointmentController.js');

const router = express.Router();

// Routes
router.post('/add', createAppointment);
router.get('/', getAppointments); // supports ?userId=<id>
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
