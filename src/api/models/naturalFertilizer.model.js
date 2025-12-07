const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String, // Image URL 
    }
});

/**
 * Organic Fertilizer Schema
 */
const naturalFertilizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Fertilizer Name Rquired'],
        unique: true,
        trim: true, // remove leading and trailing white spaces
    },
    content: { // Content Details
        type: String,
        required: [true, 'Content Rquired'],
    },
    reasonsForUse: { // Use Reasons
        type: String,
        required: true,
    },
    suitablePlants: [{ //Crops suitable for this fertilizer
        type: String,
        required:true,
    }],
    preparationMethod: [StepSchema], // Create METHOD (Schema of Steps)
    applicationMethod: [StepSchema], // Use Method (Schema of Steps)
    dosageAndTiming: { // Quantity and Time to use
        type: String,
        required: true,
    },
    generalImages: [{ // Common Images 
        type: String, // Images URL
    }]
}, {
    timestamps: true
});

const NaturalFertilizer = mongoose.model('NaturalFertilizer', naturalFertilizerSchema);

module.exports = NaturalFertilizer;