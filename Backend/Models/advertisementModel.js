const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Advertisement",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
advertisementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
