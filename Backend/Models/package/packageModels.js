const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageModels = new mongoose.Schema({
  id: {
    required: true,
    type: String,
    unique: true,
    index: true
  },
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number
  },
  currency: {
    required: true,
    type: String
  },
  image: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }
});

const Package = mongoose.model("Package", packageModels);
module.exports = Package;
