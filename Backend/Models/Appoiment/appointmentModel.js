const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
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
      enum: ['Standard', 'Premium', 'VIP'], // customize as you want
    },
    note: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
