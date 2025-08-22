const Guide = require('../../Models/Guide/guideModel.js');

// Create new guide
exports.createGuide = async (req, res) => {
  try {
    const guide = new Guide(req.body);
    await guide.save();
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set guide availability
exports.setAvailability = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { date, isAvailable } = req.body;

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    guide.availability.push({ date, isAvailable });
    await guide.save();
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add upcoming tour
exports.addTour = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { title, place, date } = req.body;

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    guide.upcomingTours.push({ title, place, date });
    await guide.save();
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get upcoming tours by guide
exports.getUpcomingTours = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guide = await Guide.findById(guideId);

    if (!guide) return res.status(404).json({ error: "Guide not found" });

    const today = new Date();
    const upcomingTours = guide.upcomingTours.filter(tour => new Date(tour.date) >= today);

    res.json(upcomingTours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
