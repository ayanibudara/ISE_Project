const Appointment = require('../../models/Appoiment/appointmentModel.js');

// Create new appointment (any authenticated user)
exports.createAppointment = async (req, res) => {
  try {
    const { membersCount, packageType, note, startDate } = req.body;

    if (!membersCount || !packageType || !startDate) {
      return res.status(400).json({ message: 'All required fields must be filled!' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
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

// Get all appointments (admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const appointments = await Appointment.find().sort({ startDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments of the logged-in user
exports.getUserAppointments = async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({ userId: req.user._id }).sort({ startDate: 1 });

    const upcoming = appointments.filter(appt => new Date(appt.startDate) >= now);
    const past = appointments.filter(appt => new Date(appt.startDate) < now);

    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single appointment by ID (owner or admin)
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment (owner or admin)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(appointment, req.body);
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment (owner or admin)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
