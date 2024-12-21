// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId:String,
  storeId:String,
  discount:Number,
  itemName:{
    type:String,
    required:true
},
discountPercentage:{
    type:Number,
    required:true
},
startDate: {
    type:Date,
    required:true
},
startTime:{
    type:String,
    required:true
},
endTime:{
    type:String,
    required:true
},
endDate:{
    type:Date,
    required:true
},
itemImage:{
    type:String,
    required:false
},
active:{
    type:Boolean,
    default:true

}
});

module.exports = mongoose.model('Discount', itemSchema);
