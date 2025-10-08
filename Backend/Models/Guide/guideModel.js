const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema(
  {
    // Reference to the user account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Basic personal information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Availability dates stored as simple objects
    availability: [
      {
        date: { type: Date, required: true },
        isAvailable: { type: Boolean, default: true },
      },
    ],

    // Upcoming tours stored as simple objects
    upcomingTours: [
      {
        title: { type: String, required: true },
        place: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guide', guideSchema);
