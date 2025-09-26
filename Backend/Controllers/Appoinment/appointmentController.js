const Appointment = require('../../Models/Appoiment/appointmentModel.js');

// @desc Create new appointment
// @route POST /api/appointments/add
exports.createAppointment = async (req, res) => {
  try {
    const { userId, userName, membersCount, packageType, note, startDate } = req.body;

    if (!userId || !userName || !membersCount || !packageType || !startDate) {
      return res.status(400).json({ message: 'All required fields must be filled!' });
    }

    const appointment = await Appointment.create({
      userId,
      userName,
      membersCount,
      packageType,
      note,
      startDate,
      status: 'booked',
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get appointments (filter by userId, return upcoming + past)
// @route GET /api/appointments?userId=<id>
exports.getAppointments = async (req, res) => {
  try {
    const { userId } = req.query;
    const now = new Date();

    let query = {};
    if (userId) query.userId = userId;

    const appointments = await Appointment.find(query).sort({ startDate: 1 });

    const upcoming = appointments.filter(appt => new Date(appt.startDate) >= now);
    const past = appointments.filter(appt => new Date(appt.startDate) < now);

    res.json({ upcoming, past });
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
