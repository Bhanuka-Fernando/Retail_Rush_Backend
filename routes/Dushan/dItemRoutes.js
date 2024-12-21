const express = require('express');
const router = express.Router();
const Item = require('../../models/itemSchema');
const asyncHandler = require('express-async-handler');

// @desc    Upload a new item
// @route   POST /api/items
// @access  Admin
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {storeId, itemId, name, category, subcategory, description, img_url, tags, price, quantity} = req.body;

    console.log(req.body);

    // Validation checks (if necessary)
    if (!storeId || !itemId || !name || !category || !img_url || !price || !quantity === undefined) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check if the item ID already exists
    /*const itemExists = await Item.findOne({ itemId });
    if (itemExists) {
      res.status(400);
      throw new Error('Item already exists');
    }*/

    // Create and save the new item
    const item = new Item({
      storeId, 
      itemId,
      name,
      category,
      subcategory,
      description,
      img_url,
      tags,
      price,
      quantity,
    });

    await item.save();

    res.status(201).json(item);
  })
);

// @desc    Get all items by storeID
// @route   GET /api/items/store/:storeID
// @access  Public
router.get(
  '/store/:storeID',
  asyncHandler(async (req, res) => {
    const { storeID } = req.params;
    console.log(req.params);
    const items = await Item.find({ storeId:storeID });

    if (items.length === 0) {
      res.status(404);
      throw new Error('No items found for this store');
    }

    res.status(200).json(items);
  })
);

// @desc    Update an item by itemId
// @route   PUT /api/items/:itemId
// @access  Admin
router.put(
  '/:itemId',
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { storeID, name, category, subcategory, description, img_url, tags, price, quantity } = req.body;

    const item = await Item.findOne({ itemId });

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Update item fields
    item.storeID = storeID || item.storeID;
    item.name = name || item.name;
    item.category = category || item.category;
    item.subcategory = subcategory || item.subcategory;
    item.description = description || item.description;
    item.img_url = img_url || item.img_url;
    item.tags = tags || item.tags;
    item.price = price !== undefined ? price : item.price;
    item.quantity = quantity !== undefined ? quantity : item.quantity;

    await item.save();

    res.status(200).json(item);
  })
);

// @desc    Delete an item by itemId
// @route   DELETE /api/items/:itemId
// @access  Admin
router.delete(
  '/:itemId',
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    const item = await Item.findOne({ itemId });

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    await item.remove();

    res.status(200).json({ message: 'Item removed successfully' });
  })
);

module.exports = router;
