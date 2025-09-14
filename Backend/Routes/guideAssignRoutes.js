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

module.exports = router;
