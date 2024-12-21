const express = require('express');
const {
    createBanner,
    getBanner,
    getAllBanners,
    deleteBanner,
    updateBanner
} = require('../../controllers/bhanuka/bannerController');

const router = express.Router();

// Get all active discounts list
router.get('/banners', getAllBanners);  // More descriptive and RESTful path

// Get a single discount by ID
router.get('/banners/:id', getBanner);  // Descriptive path

// Create a new discount
router.post('/', createBanner);  // Plural form for consistency

// Delete a discount by ID
router.delete('/banners/:id', deleteBanner);  // Plural form for consistency

// Update a discount (use PATCH for partial updates)
router.patch('/banners/:id', updateBanner);  // Plural form for consistency





module.exports = router;
