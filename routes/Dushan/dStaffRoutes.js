const express = require('express');
const router = express.Router();
const Staff = require('../../models/Dushan/dstaff'); // Ensure you use the correct path to your model

// Add a new staff member with image URL
router.post('/add', async (req, res) => {
  try {
    // Create a new staff member with the image URL provided from the frontend
    const staff = new Staff(req.body); // Assuming req.body contains the image URL
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View all staff members for a specific store
router.get('/store/:storeID', async (req, res) => {
  try {
    const staff = await Staff.find({ storeID: req.params.storeID });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View a single staff member by ID
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify a staff member with optional image URL update
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body; // req.body may include image URL
    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(200).json({ message: 'Staff member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
