const mongoose = require('mongoose');
const Package = require('../../Models/Services/packageModel.js');


const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assumes you have a User model
      required: true,//Required field
    },
    userName: {
      type: String,
      required: true,//Required field
      trim: true,//Removes unnecessary spaces
    },
    membersCount: {
      type: Number,
      required: true,
      min: 1,//Must be at least 1 member

    },
    // Reference to the selected package
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package', // references the Package model
      required: true,//Must link to a valid package
    },
    selectedTier: {
      type: String,
      required: true,
      enum: ['Standard', 'Premium', 'VIP'], //Only valid options, which tier from the package
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
        message: 'End date must be after start date.',//Custom date validation
      },
    },
    needsGuide: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['booked', 'confirmed', 'rejected', 'completed', 'cancelled'],//Prevents invalid status
      default: 'booked',
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

