const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String, // Image URL from form
      trim: true,
    },
    packages: {
      type: [
        {
          packageType: {
            type: String,
            required: true,
            enum: ['Standard', 'Premium', 'VIP'],
          },
          price: {
            type: Number,
            required: true,
            min: [1, 'Price must be greater than 0'],
          },
          tourDays: {
            type: Number,
            required: true,
            min: [1, 'Tour days must be at least 1'],
          },
          services: {
            type: String, // textarea string from form
            required: true,
            trim: true,
          },
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length === 3; // must always have all three tiers
        },
        message: 'All three package tiers (Standard, Premium, VIP) must be provided.',
      },
    },
  },
  { timestamps: true }
);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
