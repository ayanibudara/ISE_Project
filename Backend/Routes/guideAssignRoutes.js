const express = require('express');
const router = express.Router();
const GuideAssign = require('../Models/guideAssignModel');

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

// GET guide assignments by guideId
router.get('/guide/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;
    const assignments = await GuideAssign.find({ 
      guideId: guideId,
      status: { $in: ['Assigned', 'Confirmed', 'In Progress'] } // Only active assignments
    })
      .populate({
        path: 'appointmentId',
        populate: {
          path: 'packageId',
          select: 'packageName province category'
        }
      })
      .populate('touristId', 'firstName lastName email')
      .sort({ startDate: 1 }); // Sort by start date ascending
    
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch guide assignments', error: error.message });
  }
});

module.exports = router;












