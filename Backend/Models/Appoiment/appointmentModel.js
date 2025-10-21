const mongoose = require('mongoose');
const Package = require('../../Models/Services/packageModel.js');


const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assumes you have a User model
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    membersCount: {
      type: Number,
      required: true,
      min: 1,
    },
    // Reference to the selected package
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package', // references the Package model
      required: true,
    },
    selectedTier: {
      type: String,
      required: true,
      enum: ['Standard', 'Premium', 'VIP'], // which tier from the package
    },
    note: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: 'End date must be after start date.',
      },
    },
    needsGuide: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['booked', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

