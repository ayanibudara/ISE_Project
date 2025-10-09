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
