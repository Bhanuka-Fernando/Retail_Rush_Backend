// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,  // Ensures each item is associated with a store
  },
  itemId: {
    type: String,
    required: true,  // Unique ID for each item
  },
  name: {
    type: String,
    required: true,  // Name of the item
  },
  category: {
    type: String,
    required: true,  // Main category of the item
  },
  subcategory: {
    type: String,
  },
  description: {
    type: String,
  },
  img_url: {
    type: String,  // Firebase image URL will be stored here
  },
  price: {
    type: Number,  // Price of the item
    required: true,
  },
  quantity: {
    type: Number,  // Stock quantity of the item
    required: true,
    default: 0,  // Default quantity is 0 if not provided
  },
  tags: {
    type: [String],  // Tags related to the item
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Item', itemSchema);
