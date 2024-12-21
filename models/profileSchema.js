// models/User.js
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag:String,
    count:Number,
});
const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  tags:[tagSchema],
  password:String
});

module.exports = mongoose.model('Profile', userSchema);
