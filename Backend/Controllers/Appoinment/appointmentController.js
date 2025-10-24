const Appointment = require('../../models/Appoiment/appointmentModel.js');
const User = require('../../models/User.js');
const Package = require('../../Models/Services/packageModel.js');

// Create new appointment (any authenticated user)
exports.createAppointment = async (req, res) => {
  try {
    const { 
      userId, 
      userName, 
      membersCount, 
      packageId, 
      selectedTier, 
      note, 
      startDate, 
      endDate,
      needsGuide // 🟢 new field added
    } = req.body;

    // Check required fields validation
    if (!userId || !userName || !membersCount || !packageId || !selectedTier || !startDate || !endDate) {
      return res.status(400).json({ message: 'All required fields must be filled!' });
    }

    // Validate that endDate is after startDate
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date!' });
    }

    // Validate selectedTier
    if (!['Standard', 'Premium', 'VIP'].includes(selectedTier)) {
      return res.status(400).json({ message: 'Invalid tier selected!' });
    }

    // Create new appointment
    const appointment = await Appointment.create({
      userId,
      userName,
      membersCount,
      packageId,
      selectedTier,
      note,
      startDate,
      endDate,
      needsGuide: needsGuide || false, // 🟢 default false if not provided (validation)
      status: 'booked',
    });

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get appointments for the logged-in user only
exports.getUserAppointments = async (req, res) => {
  try {
    const now = new Date();

    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ startDate: 1 })
      .populate('userId', 'firstName lastName email role')
      .populate('packageId'); // populate package info

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
      .populate('userId', 'firstName lastName email')
      .populate('packageId'); // populate package info

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
    const { id } = req.params;

    // Fetch appointment and populate packageId + userId
    const appointment = await Appointment.findById(id)
      .populate('packageId', 'packageName packages') // ← critical line
      .populate('userId', '_id name email'); // optional, but good for safety

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optional: Add ownership check here (more secure than frontend-only)
  

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({ message: 'Server error while fetching appointment' });
  }
};


// Update appointment (owner or admin)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

 

    // Only allow updates to certain fields
    const updatableFields = ['membersCount', 'packageId', 'selectedTier', 'note', 'startDate', 'endDate', 'status','needsGuide'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });

    // Again Validate endDate after startDate 
    if (appointment.startDate && appointment.endDate && new Date(appointment.endDate) <= new Date(appointment.startDate)) {
      return res.status(400).json({ message: 'End date must be after start date!' });
    }
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
// Ownership / authorization validation
    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// At the end of your appointmentController.js file, add:

// 🆕 Get pending appointments that need guide assignment
exports.getPendingAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ 
      needsGuide: true,
      status: 'booked'
    })
    .populate('userId', 'firstName lastName email mobile')
    .populate('packageId', 'packageName category')
    .sort({ createdAt: -1 });

    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error('Error fetching pending appointments:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pending appointments', 
      error: error.message 
    });
  }
};

// 🆕 Update appointment status (for guide assignment)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('userId', 'firstName lastName email mobile')
    .populate('packageId', 'packageName');

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to update appointment', 
      error: error.message 
    });
  }
};

exports.getProviderAppointments = async (req, res) => {
  try {
    const providerId = req.user._id;

    // 1️⃣ Find all packages by this provider
    const providerPackages = await Package.find({ providerId }).select('_id packageName category province description image packages');

    if (!providerPackages.length) {
      return res.status(200).json({ message: 'No packages found for this provider', appointments: [] });
    }

    const packageIds = providerPackages.map(pkg => pkg._id);

    // 2️⃣ Find all appointments linked to these packages, populate user and package
    const appointments = await Appointment.find({ packageId: { $in: packageIds } })
      .populate('userId', 'firstName lastName email role') // user info
      .populate('packageId', 'packageName category province description image packages') // package info
      .sort({ startDate: 1 });

    // 3️⃣ Return results
    res.status(200).json({
      totalAppointments: appointments.length,
      providerId,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching provider appointments:', error);
    res.status(500).json({
      message: 'Failed to fetch provider appointments',
      error: error.message,
    });
  }

};

// 🟢 Confirm an appointment (by provider or admin)
exports.confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure the provider owns the package
    //Provider ownership validation
    const pkg = await Package.findById(appointment.packageId);
    if (!pkg || pkg.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this appointment' });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.status(200).json({
      message: 'Appointment confirmed successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ message: 'Failed to confirm appointment', error: error.message });
  }
};
// 🔴 Reject an appointment (status only, no payload required)
exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure the provider owns the package
    const pkg = await Package.findById(appointment.packageId);
    if (!pkg || pkg.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this appointment' });
    }

    appointment.status = 'rejected'; 
    await appointment.save();

    res.status(200).json({
      message: 'Appointment rejected successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    res.status(500).json({ message: 'Failed to reject appointment', error: error.message });
  }
};
