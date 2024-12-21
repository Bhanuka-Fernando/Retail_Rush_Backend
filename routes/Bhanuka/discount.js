const express = require('express');
const {
    createDiscount,
    getDiscount,
    getAllDiscounts,
    deleteDiscount,
    updateDiscount,
    deleteExpiredItem,
    getActiveDiscounts
    
} = require('../../controllers/bhanuka/discountController');

const router = express.Router();

// Get all active discounts list
router.get('/discounts', getAllDiscounts);  // More descriptive and RESTful path

// Get a single discount by ID
router.get('/discounts/:id', getDiscount);  // Descriptive path

// Create a new discount
router.post('/', createDiscount);  // Plural form for consistency

// Delete a discount by ID
router.delete('/discounts/:id', deleteDiscount);  // Plural form for consistency

// Update a discount (use PATCH for partial updates)
router.patch('/discounts/:id', updateDiscount);  // Plural form for consistency

router.post('/deleteExpired', deleteExpiredItem)

router.get('/activeDiscounts', getActiveDiscounts);



module.exports = router;
