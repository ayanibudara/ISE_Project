const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Mongoose Schema & Model
const guideAssignSchema = new mongoose.Schema({
  guideId: String,
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  paymentPerDay: Number,
  totalPayment: Number,
  status: String,
});

const GuideAssign = mongoose.model('GuideAssign', guideAssignSchema);

// POST route to create a new assignment
router.post('/', async (req, res) => {
  try {
    const newAssign = new GuideAssign(req.body);
    const savedAssign = await newAssign.save();
    res.status(201).json(savedAssign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all guide assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await GuideAssign.find()
      .populate('guideId', 'name')
      .populate('touristId', 'firstName lastName');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
});


module.exports = router;












