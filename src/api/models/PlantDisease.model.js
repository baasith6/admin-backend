const mongoose = require('mongoose');

/**
 * தாவர நோய்களுக்கான ஸ்கீமா
 */
const plantDiseaseSchema = new mongoose.Schema({
    cropType: { // பயிர் வகை (எ.கா: தானியம், காய்கறி)
        type: String,
        required: true,
    },
    cropName: { // பயிரின் பெயர் (எ.கா: நெல், தக்காளி)
        type: String,
        required: true,
    },
    diseaseName: { // நோயின் பெயர்
        type: String,
        required: true,
    },
    affectedPart: { // நோயால் பாதிக்கப்பட்ட தாவரப் பகுதி
        type: String,
    },
    symptoms: { // நோயின் அறிகுறிகள்
        type: String,
        required: true,
    },
    causes: { // நோய் வருவதற்கான காரணங்கள்
        type: String,
    },
    chemicalSolutions: [{ // இரசாயன தீர்வுகள்
        type: String,
    }],
    naturalSolutions: [{ // இயற்கை தீர்வுகள்
        type: String,
    }],
    symptomImages: [{ // நோயுற்ற பயிர்களின் புகைப்படங்கள்
        type: String, // படங்களின் URL-கள்
        required: [true, 'நோயின் அறிகுறிகளை அடையாளம் காண புகைப்படம் அவசியம்'],
    }]
}, {
    timestamps: true
});

const PlantDisease = mongoose.model('PlantDisease', plantDiseaseSchema);

module.exports = PlantDisease;