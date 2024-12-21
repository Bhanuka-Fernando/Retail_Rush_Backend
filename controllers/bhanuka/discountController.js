//const Discount = require('../../models/Bhanuka/discountModel')
const Discount = require('../../models/discountModel');

const mongoose = require('mongoose')

// get all discounts details
const getAllDiscounts = async (req, res) => {

    try {
        const discounts = await Discount.find({}).sort({ createdAt: -1 });
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discounts' });
    }
};



//get a single discount detail
const getDiscount = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const discount = await Discount.findById(id);
    if (!discount) {
        return res.status(404).json({ error: 'No such a Discount' });
    }
    res.status(200).json(discount);
};


// create a new discount detail
const createDiscount = async (req, res) => {
    const { itemId, storeId, itemName, discountPercentage, startDate, endDate, startTime, endTime, itemImage, active } = req.body;

    // Add doc to db
    try {
        const discount = await Discount.create({ itemId, storeId, itemName, discountPercentage, startDate, endDate, startTime, endTime, itemImage, active });
        res.status(200).json(discount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a discount 
const deleteDiscount = async (req, res) => {
    const { id } = req.params;

    // Check that id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const discount = await Discount.findOneAndDelete({ _id: id });

    if (!discount) {
        return res.status(400).json({ error: 'No such a discount' });
    }
    res.status(200).json(discount);
};


// update discount detail
const updateDiscount = async (req, res) => {
    const { id } = req.params;

    // Check that id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const discount = await Discount.findOneAndUpdate({ _id: id }, req.body, { new: true }); // Return the updated document

    if (!discount) {
        return res.status(400).json({ error: 'No such a discount' });
    }
    res.status(200).json(discount);
};

const deleteExpiredItem = async (req,res) => {
    const currentDateTime = new Date();

    try {
      // Find and delete expired discounts
      const result = await Discount.deleteMany({
        $or: [
          { endDate: { $lt: currentDateTime } },
          {
            $and: [
              { endDate: currentDateTime.toISOString().slice(0, 10) },
              { endTime: { $lte: currentDateTime.toTimeString().slice(0, 5) } }
            ]
          }
        ]
      });
  
      res.status(200).json({ message: `Deleted ${result.deletedCount} expired discounts` });
    } catch (error) {
      console.error('Error deleting expired discounts:', error);
      res.status(500).json({ error: 'Failed to delete expired discounts' });
    }
}

// In your BFdiscountController.js
const getActiveDiscounts = async (req, res) => {
    const currentDateTime = new Date();
    try {
        const discounts = await Discount.find({
            $or: [
                { endDate: { $gt: currentDateTime } },
                {
                    $and: [
                        { endDate: currentDateTime.toISOString().slice(0, 10) },
                        { endTime: { $gt: currentDateTime.toTimeString().slice(0, 5) } }
                    ]
                }
            ]
        }).sort({ createdAt: -1 });
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active discounts' });
    }
};



module.exports = {
    createDiscount,
    getDiscount,
    getAllDiscounts,
    deleteDiscount,
    updateDiscount,
    deleteExpiredItem,
    getActiveDiscounts
}