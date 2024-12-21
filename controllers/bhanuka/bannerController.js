const Banner = require('../../models/Bhanuka/bannerModel')
const mongoose = require('mongoose')

// get all discounts details
const getAllBanners = async (req, res) => {

    try {
        const banner = await Banner.find({}).sort({ createdAt: -1 });
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banner' });
    }
};



//get a single discount detail
const getBanner = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
        return res.status(404).json({ error: 'No such a banner' });
    }
    res.status(200).json(banner);
};


// create a new discount detail
const createBanner = async (req, res) => {
    const { bannerImage } = req.body;

    // Add doc to db
    try {
        const banner = await Banner.create({ bannerImage});
        res.status(200).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a discount 
const deleteBanner = async (req, res) => {
    const { id } = req.params;

    // Check that id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const banner = await Banner.findOneAndDelete({ _id: id });

    if (!banner) {
        return res.status(400).json({ error: 'No such a discount' });
    }
    res.status(200).json(banner);
};


// update discount detail
const updateBanner = async (req, res) => {
    const { id } = req.params;

    // Check that id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such a discount' });
    }

    const banner = await Banner.findOneAndUpdate({ _id: id }, req.body, { new: true }); // Return the updated document

    if (!banner) {
        return res.status(400).json({ error: 'No such a discount' });
    }
    res.status(200).json(banner);
};




module.exports = {
    createBanner,
    getBanner,
    getAllBanners,
    deleteBanner,
    updateBanner
}