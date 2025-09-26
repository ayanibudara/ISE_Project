const mongoose = require('mongoose');

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
    packageType: {
      type: String,
      required: true,
      enum: ['Standard', 'Premium', 'VIP'], // customize as needed
    },
    note: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
