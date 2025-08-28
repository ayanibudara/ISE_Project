const mongoose = require("mongoose");

const guideAssignSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  travellerName: {
    type: String,
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  paymentPerDay: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "Completed"],
    default: "Pending",
  }
}, { timestamps: true });

module.exports = mongoose.model("GuideAssign", guideAssignSchema);
