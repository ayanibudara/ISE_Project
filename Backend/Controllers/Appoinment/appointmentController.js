const Appointment = require('../../models/Appoiment/appointmentModel.js');
const User = require('../../models/User.js');
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

    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments for the logged-in user only
// Get appointments for the logged-in user only
exports.getUserAppointments = async (req, res) => {
  try {
    const now = new Date();

    // Find appointments for the user from token
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ startDate: 1 })
      .populate('userId', 'firstName lastName email'); // optional: populate user info

    const upcoming = appointments.filter(appt => new Date(appt.startDate) >= now);
    const past = appointments.filter(appt => new Date(appt.startDate) < now);

    res.status(200).json({
      totalAppointments: appointments.length,
      upcoming,
      past,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Admin: get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ startDate: 1 })
      .populate('userId', 'firstName lastName email'); // populate user info

    res.status(200).json({
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all appointments', error: error.message });
  }
};


// Get a single appointment (owner or admin)
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ appointment });
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

    res.json({ message: 'Appointment updated', appointment });
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
