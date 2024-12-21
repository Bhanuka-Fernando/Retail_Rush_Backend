// dRegisteredStores.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the store schema
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    storeId: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
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
}, {
    timestamps: true,
});

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

const RegisteredStore = mongoose.model('RegisteredStore', storeSchema);
module.exports = RegisteredStore;
