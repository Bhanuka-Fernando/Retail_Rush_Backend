// dSalesRoutes.js
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const SalesData = require('../../models/Dushan/dSales'); // Import the SalesData model from dSales.js

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route for uploading the CSV file
router.post('/upload-csv', upload.single('csv'), (req, res) => {
    const filePath = req.file.path;
    const salesDataArray = [];

    // Read the CSV file and parse it
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            const salesData = {
                month: row['Month'],
                year: parseInt(row['Year']),  // Added year field
                itemID: row['ItemID'],
                quantity: parseInt(row['Quantity']),
                category: row['Category'],
                salePrice: parseFloat(row['Sale Price']),
                storeID: row['StoreID']  // Added storeID field
            };
            salesDataArray.push(salesData);
        })
        .on('end', async () => {
            try {
                // Insert parsed CSV data into MongoDB
                await SalesData.insertMany(salesDataArray);
                res.status(200).send('CSV data successfully uploaded and stored');
            } catch (error) {
                console.error('Error inserting data:', error);
                res.status(500).send('Error saving data to database');
            } finally {
                // Delete the uploaded file
                fs.unlinkSync(filePath);
            }
        });
});

// Route for retrieving sales data by storeID
router.get('/:storeID', async (req, res) => { // Removed `/sales` prefix
    const storeID = req.params.storeID;
    
    try {
        const salesData = await SalesData.find({ storeID });
        res.json(salesData);
    } catch (error) {
        console.error('Error retrieving sales data:', error);
        res.status(500).send('Error retrieving sales data');
    }
});

// Aggregated sales data for charts (optional)
router.get('/aggregate/:storeID', async (req, res) => { // Removed `/sales` prefix
    const storeID = req.params.storeID;

    try {
        const aggregatedData = await SalesData.aggregate([
            { $match: { storeID } },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    totalSales: { $sum: "$salePrice" },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        res.json(aggregatedData);
    } catch (error) {
        console.error('Error retrieving aggregated data:', error);
        res.status(500).send('Error retrieving sales data');
    }
});

module.exports = router;
