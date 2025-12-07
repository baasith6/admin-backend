const express = require('express');
const router = express.Router();

// கன்ட்ரோலர் மற்றும் மிடில்வேரை இறக்குமதி செய்யவும்
const fertilizerController = require('../controllers/naturalFertilizer.controller');
const { uploadFertilizerImages } = require('../../middlewares/fileUpload.middleware');
const { protect, admin } = require('../../middlewares/auth.middleware'); // நிர்வாகி மட்டும் அணுகுவதற்காக

// --- API வழிகள் ---

// POST /api/v1/fertilizers -> புதிய உரத்தை உருவாக்குதல் (நிர்வாகி மட்டும்)
// `uploadFertilizerImages` மிடில்வேர் படங்களைக் கையாளும்
router.post(
    '/',
    protect, // பயனர் உள்நுழைந்துள்ளாரா என சரிபார்க்க
    admin,   // பயனர் நிர்வாகியா என சரிபார்க்க
    uploadFertilizerImages, 
    fertilizerController.createFertilizer
);

// GET /api/v1/fertilizers -> அனைத்து உரங்களையும் பெறுதல் (அனைவரும் பார்க்கலாம்)
router.get('/', fertilizerController.getAllFertilizers);

// GET /api/v1/fertilizers/:id -> ஒரு குறிப்பிட்ட உரத்தைப் பெறுதல்
router.get('/:id', fertilizerController.getFertilizerById);

// PUT /api/v1/fertilizers/:id -> ஒரு உரத்தைப் புதுப்பித்தல் (நிர்வாகி மட்டும்)
router.put(
    '/:id', 
    protect, admin, 
    uploadFertilizerImages, 
    fertilizerController.updateFertilizer
);

// DELETE /api/v1/fertilizers/:id -> ஒரு உரத்தை நீக்குதல் (நிர்வாகி மட்டும்)
router.delete(
    '/:id', 
    protect, admin, 
    fertilizerController.deleteFertilizer
);


module.exports = router;