const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
});

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  place: { type: String, required: true },
  date: { type: Date, required: true },
});

const guideSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  availability: [availabilitySchema],
  upcomingTours: [tourSchema],
});

module.exports = mongoose.model('Guide', guideSchema);
