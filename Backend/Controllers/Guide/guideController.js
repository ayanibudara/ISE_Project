const Guide = require('../../Models/Guide/guideModel.js');


// ✅ Create a new guide
exports.createGuide = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      age,
      email,
      availability,
      upcomingTours,
    } = req.body;

    // Check if guide already exists
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return res.status(400).json({ message: 'Guide with this email already exists.' });
    }

    const newGuide = new Guide({
      userId,
      firstName,
      lastName,
      age,
      email,
      availability,
      upcomingTours,
    });

    const savedGuide = await newGuide.save();
    res.status(201).json(savedGuide);
  } catch (err) {
    console.error('Error creating guide:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get guide availability
exports.getAvailability = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id, 'availability');
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    res.status(200).json({ availability: guide.availability });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().populate('userId', 'firstName lastName email');
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update guide details
exports.updateGuide = async (req, res) => {
  try {
    const updatedGuide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedGuide) return res.status(404).json({ message: 'Guide not found' });
    res.status(200).json(updatedGuide);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete guide
exports.deleteGuide = async (req, res) => {
  try {
    const deletedGuide = await Guide.findByIdAndDelete(req.params.id);
    if (!deletedGuide) return res.status(404).json({ message: 'Guide not found' });
    res.status(200).json({ message: 'Guide deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Add availability
exports.addAvailability = async (req, res) => {
  try {
    const { date, isAvailable } = req.body;
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    guide.availability.push({ date, isAvailable });
    await guide.save();

    res.status(200).json({ message: 'Availability added successfully', guide });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Add upcoming tour
exports.addUpcomingTour = async (req, res) => {
  try {
    const { title, place, date } = req.body;
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    guide.upcomingTours.push({ title, place, date });
    await guide.save();

    res.status(200).json({ message: 'Upcoming tour added successfully', guide });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Remove upcoming tour
exports.removeUpcomingTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const guide = await Guide.findOneAndUpdate(
      { 'upcomingTours._id': tourId },
      { $pull: { upcomingTours: { _id: tourId } } },
      { new: true }
    );

    if (!guide) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json({ message: 'Tour removed successfully', guide });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
