const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String, // You can store URL or path
      trim: true,
    },
    packageType: {
      type: String,
      required: true,
      enum: ['Standard', 'Premium', 'VIP'],
    },
  },
  { timestamps: true }
);

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
