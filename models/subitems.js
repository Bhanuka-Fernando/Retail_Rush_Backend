const mongoose = require('mongoose');

const subitems = new mongoose.Schema({
    name : {type:String,required:true},
    storeId:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    superItem:{ type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required:true}
});

module.exports = mongoose.model('Subitems', subitems);

