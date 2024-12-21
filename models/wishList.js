const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 }
});

const WishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] // Reference to items
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
