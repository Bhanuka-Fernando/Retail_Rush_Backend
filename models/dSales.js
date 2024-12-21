const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
    month: { type: String, required: true },
    itemID: { type: String, required: true },  // Updated to itemID
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    salePrice: { type: Number, required: true }
});

const SalesData = mongoose.model('SalesData', salesDataSchema);

module.exports = SalesData;
