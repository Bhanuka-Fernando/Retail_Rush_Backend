const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bannerSchema = new Schema({
    
    bannerImage: {
        type:String,
        required:true
    }
    
    
}, {timestamps:true})

module.exports = mongoose.model('Banner', bannerSchema)