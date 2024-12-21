const mongoose = require('mongoose');

const SuperItemSchema = new mongoose.Schema({
    
    category: {
        type: String,
        required: true
    },

    categoryId:{
        type:String,
        //required:true
    },
    
    subItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'  // Reference to the Item schema
    }]
});

const SuperItem = mongoose.model('SuperItem', SuperItemSchema);
module.exports = SuperItem;
