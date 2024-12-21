const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  storeID: { type: String, required: true }, // Store ID comes first
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
  imageUrl: { type: String }, // Field to store the URL of the staff image
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
