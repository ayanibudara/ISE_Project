const Appointment = require('../../Models/Appoiment/appointmentModel.js');

// @desc Create new appointment
// @route POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { userName, membersCount, packageType, note, startDate } = req.body;

    if (!userName || !membersCount || !packageType || !startDate) {
      return res.status(400).json({ message: 'All required fields must be filled!' });
    }

    const appointment = await Appointment.create({
      userName,
      membersCount,
      packageType,
      note,
      startDate,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all appointments
// @route GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ startDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single appointment
// @route GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update appointment
// @route PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete appointment
// @route DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
