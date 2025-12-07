const mongoose = require('mongoose');

/**
 * பொதுவான தகவல்களுக்கான ஸ்கீமா
 */
const generalInfoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'தலைப்பு அவசியம்'],
    },
    content: {
        type: String,
        required: [true, 'உள்ளடக்கம் அவசியம்'],
    },
    category: {
        type: String,
        required: true,
        enum: ['Article', 'SuccessStory', 'SeedTreatment', 'GeneralTip', 'Video'], // வகைப்படுத்த
    },
    author: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    publishedAt: {
        type: Date,
    },
    imageUrl: { // சிறுபடம் (Thumbnail) அல்லது முக்கியப் படம்
        type: String,
    },
    videoUrl: { // வீடியோ என்றால் அதன் URL
        type: String,
    }
}, {
    timestamps: true
});

const GeneralInfo = mongoose.model('GeneralInfo', generalInfoSchema);

module.exports = GeneralInfo;