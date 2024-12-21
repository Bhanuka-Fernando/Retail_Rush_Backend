// models/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // Basic email validation
  },
  review: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming a rating scale of 1 to 5
  },
  storeId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  response: {
    type: String,
    default: null, // To store admin/business response
  },
  helpfulVotes: {
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Review", reviewSchema);
