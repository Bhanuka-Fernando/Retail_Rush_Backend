const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: Number, required: true },  // Added year field
    itemID: { type: String, required: true },  // Updated to itemID
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    salePrice: { type: Number, required: true },
    storeID: { type: String, required: true }  // Added storeID field
});

const SalesData = mongoose.model('SalesData', salesDataSchema);

module.exports = SalesData;
