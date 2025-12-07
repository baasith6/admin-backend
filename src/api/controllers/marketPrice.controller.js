const MarketPrice = require('../models/marketPrice.model');
const mongoose = require('mongoose');

// @desc    புதிய சந்தை விலையை உருவாக்குதல்
// @route   POST /api/v1/market-prices
// @access  Private/Admin
exports.createMarketPrice = async (req, res) => {
    try {
        const { cropName, marketName, price, location, date } = req.body;
        const marketPrice = await MarketPrice.create({ cropName, marketName, price, location, date });
        res.status(201).json(marketPrice);
    } catch (error) {
        res.status(400).json({ message: 'சந்தை விலையை உருவாக்க முடியவில்லை', error: error.message });
    }
};

// @desc    அனைத்து சந்தை விலைகளையும் பெறுதல்
// @route   GET /api/v1/market-prices
// @access  Public
exports.getAllMarketPrices = async (req, res) => {
    try {
        const marketPrices = await MarketPrice.find({}).sort({ date: -1 }); // சமீபத்திய விலை முதலில் வர
        res.json(marketPrices);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    ID மூலம் ஒரு சந்தை விலையைப் பெறுதல்
// @route   GET /api/v1/market-prices/:id
// @access  Public
exports.getMarketPriceById = async (req, res) => {
    try {
        const marketPrice = await MarketPrice.findById(req.params.id);
        if (!marketPrice) {
            return res.status(404).json({ message: 'சந்தை விலை கிடைக்கவில்லை' });
        }
        res.json(marketPrice);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    ஒரு சந்தை விலையைப் புதுப்பித்தல்
// @route   PUT /api/v1/market-prices/:id
// @access  Private/Admin
exports.updateMarketPrice = async (req, res) => {
    try {
        const updatedMarketPrice = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedMarketPrice) {
            return res.status(404).json({ message: 'சந்தை விலை கிடைக்கவில்லை' });
        }
        res.json(updatedMarketPrice);
    } catch (error) {
        res.status(400).json({ message: 'புதுப்பிக்க முடியவில்லை', error: error.message });
    }
};

// @desc    ஒரு சந்தை விலையை நீக்குதல்
// @route   DELETE /api/v1/market-prices/:id
// @access  Private/Admin
exports.deleteMarketPrice = async (req, res) => {
    try {
        const marketPrice = await MarketPrice.findByIdAndDelete(req.params.id);
         if (!marketPrice) {
            return res.status(404).json({ message: 'சந்தை விலை கிடைக்கவில்லை' });
        }
        res.json({ message: 'சந்தை விலை நீக்கப்பட்டது' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};