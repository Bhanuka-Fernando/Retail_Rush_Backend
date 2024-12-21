const express = require('express');
const router = express.Router();
//const RegisteredStore = require('../models/dRegisteredStores');
const RegisteredStore = require('../../models/storeSchema');
const asyncHandler = require('express-async-handler');

// @desc Fetch a store by ID
// @route GET /api/stores/:storeId
// @access Public
router.get(
    '/:storeId',
    asyncHandler(async (req, res) => {

        console.log()
        const store = await RegisteredStore.findOne({ storeId: req.params.storeId });

        console.log('store',store);
        console.log("--------------------");
        console.log(store.location)

        if (store) {
            res.json({
                _id: store._id,
                name: store.name,
                location:store.location,
                email: store.contactInfo.email,
                description: store.description,
                storeId: store.storeId,
                profileImage: store.profileImage,
                
            });
        } else {
            res.status(404);
            throw new Error('Store not found');
        }
    })
);

// @desc Register a new store
// @route POST /api/stores
// @access Admin
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name,
            password,
            storeId,
            description,
            location,
            categories,
            contactInfo,
            operatingHours,
            rating,
            items,
            tags,
            logo_url,
            profileImage,
            images, } = req.body;

            let email = contactInfo.email;

            console.log(req.body);

        // Check if the store already exists
        const storeExists = await RegisteredStore.findOne({'contactInfo.email':email });
        console.log("STOREEXIST",storeExists);
        if (storeExists) {
            res.status(400);
            throw new Error('Store already exists');
        }

        // Validate the Firebase profile image URL (optional)
        /*if (profileImage && !/^https?:\/\/.+/.test(profileImage)) {
            res.status(400);
            throw new Error('Invalid profile image URL');
        }*/

        // Create a new store
        const store = await RegisteredStore.create({
            name,
            password,
            storeId,
            description,
            location,
            categories,
            contactInfo,
            operatingHours,
            rating,
            items,
            tags,
            profileImage,
            /*name,
            email,
            password,
            description,
            storeId,
            profileImage,  // This will store the Firebase URL
            location,*/
        });

        if (store) {
            res.status(201).json({
                _id: store._id,
                name: store.name,
                email: store.email,
                description: store.description,
                storeId: store.storeId,
                profileImage: store.profileImage,
                location: store.location,
            });
        } else {
            res.status(400);
            throw new Error('Invalid store data');
        }
    })
);


// @desc Update a store by ID
// @route PUT /api/stores/:storeId
// @access Admin
router.put(
    '/:storeId',
    asyncHandler(async (req, res) => {
        const { name, email, description, profileImage, location } = req.body;

        // Find the store by ID
        const store = await RegisteredStore.findOne({ storeId: req.params.storeId });

        if (store) {
            // Validate the Firebase profile image URL (optional)
            if (profileImage && !/^https?:\/\/.+/.test(profileImage)) {
                res.status(400);
                throw new Error('Invalid profile image URL');
            }

            // Update fields only if they are provided in the request body
            store.name = name || store.name;
            store.email = email || store.email;
            store.description = description || store.description;
            store.profileImage = profileImage || store.profileImage;
            store.location = location || store.location;

            const updatedStore = await store.save();

            res.json({
                _id: updatedStore._id,
                name: updatedStore.name,
                email: updatedStore.email,
                description: updatedStore.description,
                storeId: updatedStore.storeId,
                profileImage: updatedStore.profileImage,
                location: updatedStore.location,
            });
        } else {
            res.status(404);
            throw new Error('Store not found');
        }
    })
);



router.route("/").get(async (req, res) => {
    console.log("stores roue")
    try {
      const reviews = await RegisteredStore.find({});
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  });
  
  // Fetch a single store by ID
  // Fetch a store by ID
  router.get(
    "/:storeId",
    asyncHandler(async (req, res) => {
      const storeId = req.params.storeId; // Get the store ID from the request parameters
  
      console.log(`Fetching store with ID: ${storeId}`); // Log the ID being fetched
  
      const store = await RegisteredStore.findOne({ storeId }); // Ensure you are using the correct field
  
      if (!store) {
        console.error(`Store not found for ID: ${storeId}`); // Log if store is not found
        return res.status(404).json({ message: "Store not found" }); // Handle case where store is not found
      }
  
      res.json({
        _id: store._id,
        name: store.name,
        location: store.location,
        email: store.contactInfo.email,
        description: store.description,
        storeId: store.storeId,
        profileImage: store.profileImage,
      });
    })
  );

module.exports = router;
