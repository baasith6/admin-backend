const mongoose = require('mongoose');

/**
 * பயிர் பராமரிப்புக்கான ஸ்கீமா
 */
const cropMaintenanceSchema = new mongoose.Schema({
    cropType: { // பயிர் வகை
        type: String,
        required: true,
    },
    cropName: { // பயிரின் பெயர்
        type: String,
        required: true,
    },
    season: { // பருவகாலம்
        type: String,
    },
    growthStage: { // வளர்ச்சி நிலை (நாற்று, தூர் கட்டுதல்)
        type: String,
        required: true,
    },
    activity: { // செய்ய வேண்டிய பராமரிப்பு
        type: String,
        required: true,
    },
    reason: { // அதற்கான காரணம்
        type: String,
    },
    recommendedFertilizers: { // பயன்படுத்த வேண்டிய உரங்கள்
        type: String,
    },
    images: [{ // தொடர்புடைய புகைப்படங்கள்
        type: String, // படங்களின் URL-கள்
    }]
}, {
    timestamps: true
});

const CropMaintenance = mongoose.model('CropMaintenance', cropMaintenanceSchema);

module.exports = CropMaintenance;