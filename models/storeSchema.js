const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  storeId:{
    type:String,
    required:true,
    unique:true,
    
  },
  description: {
    type: String,
    required: true
  },
  location: {
    floorNumber: {
        type: Number,
        required: true,
    },
    storeNumber: {
        type: String,
        required: true,
    },
},
  categories: {
    type: [String], // Categories of items the store sells, e.g., "Electronics", "Fashion"
    
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique:true
    }
  },
  operatingHours: {
    open: {
      type: String, // Opening time e.g., "9:00 AM"
      required: true
    },
    close: {
      type: String, // Closing time e.g., "9:00 PM"
      required: true
    }
  },
  rating: {
    type: Number, // Average store rating
    min: 0,
    max: 5,
    default: 0
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to items the store sells
    ref: 'Item'
  }],
  tags: [String], // Tags for filtering or categorizing stores
  profileImage: {
    type: String // URL for the store's logo
  },
  images: [String], // URLs of store images
}, { timestamps: true });


// Password hashing middleware
storeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Define a method to check password validity
storeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('Store', storeSchema);
