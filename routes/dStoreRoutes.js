// storeRoutes.js
const express = require('express');
const router = express.Router();
const RegisteredStore = require('../models/dRegisteredStores');
const asyncHandler = require('express-async-handler');

// @desc Register a new store
// @route POST /api/stores
// @access Admin

router.get(
    '/:storeID',
    asyncHandler(async (req, res) => {
        const store = await RegisteredStore.findOne({ storeID: req.params.storeID });

        if (store) {
            res.json({
                _id: store._id,
                name: store.name,
                email: store.email,
                description: store.description,
                storeID: store.storeID,
                profileImage: store.profileImage,
                location: store.location,
            });
        } else {
            res.status(404);
            throw new Error('Store not found');
        }
    }),
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, email, password, description, storeID, profileImage, location } = req.body;

        // Check if the store already exists
        const storeExists = await RegisteredStore.findOne({ email });
        if (storeExists) {
            res.status(400);
            throw new Error('Store already exists');
        }

        // Create a new store
        const store = await RegisteredStore.create({
            name,
            email,
            password,
            description,
            storeID,
            profileImage,
            location,
        });

        if (store) {
            res.status(201).json({
                _id: store._id,
                name: store.name,
                email: store.email,
                description: store.description,
                storeID: store.storeID,
                profileImage: store.profileImage,
                location: store.location,
            });
        } else {
            res.status(400);
            throw new Error('Invalid store data');
        }
    })

    
));

module.exports = router;
