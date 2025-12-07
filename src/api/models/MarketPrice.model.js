const mongoose = require('mongoose');

/**
 * தினசரி சந்தை விலைக்கான ஸ்கீமா
 */
const marketPriceSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: [true, 'Crop Name Rquired'],
        trim: true,
    },
    marketName: {
        type: String,
        required: [true, 'Market Name Rquired'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price Rquired'],
        min: [0, 'Price must be positive number'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String, // Markect LOcation
    }
}, {
    timestamps: true // createdAt and updatedAt Add Cloumns
});

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

module.exports = MarketPrice;