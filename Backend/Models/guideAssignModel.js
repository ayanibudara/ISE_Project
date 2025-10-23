const mongoose = require('mongoose');

const guideAssignSchema = new mongoose.Schema({

// ✅ Link to appointment
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },



  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

// ✅ Add these fields that your frontend sends
  totalDays: {
    type: Number,
    required: true
  },
  //paymentPerDay: {
    //type: Number,
    //required: true
 // },
 // totalPayment: {
    //type: Number,
   // required: true
 // },
  

  location: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Assigned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Assigned'
  },
  specialRequirements: {
    type: String
  },



  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
guideAssignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to check guide availability
guideAssignSchema.statics.findAvailableGuides = async function(startDate, endDate, location) {
  try {
    // Find guides who have overlapping assignments
    const overlappingAssignments = await this.find({
      status: { $in: ['Assigned', 'Confirmed', 'In Progress'] }, // Only consider active assignments
      $or: [
        // Case 1: New assignment starts during existing assignment
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
        // Case 2: New assignment ends during existing assignment
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
        // Case 3: New assignment completely contains existing assignment
        { startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } }
      ]
    }).populate('guideId');

    // Get IDs of busy guides
    const busyGuideIds = overlappingAssignments.map(assignment => assignment.guideId._id);

    // Find all guides (you might want to filter by role, location, etc.)
    const User = mongoose.model('User');
    const availableGuides = await User.find({
      _id: { $nin: busyGuideIds },
      role: 'Guide', // Only include users with Guide role
      // Add location filter if needed
      // location: location 
    }).select('firstName lastName email specialization experience mobile');

    return availableGuides;
  } catch (error) {
    throw new Error(`Error finding available guides: ${error.message}`);
  }
};

// Avoid OverwriteModelError by checking if model exists
module.exports = mongoose.models.GuideAssign || mongoose.model('GuideAssign', guideAssignSchema);