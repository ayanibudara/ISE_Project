const mongoose = require("mongoose");

const categoryModels = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    unique: true, // Unique constraint
    index: true,  // For better performance
    trim: true    // Trim whitespace
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  }
});

const Category = mongoose.model('Category', categoryModels);

module.exports = Category;
