const express = require('express');
const router = express.Router();

// கன்ட்ரோலர் மற்றும் மிடில்வேரை இறக்குமதி செய்யவும்
const diseaseController = require('../controllers/plantDisease.controller');

const { uploadDiseaseImages } = require('../../middlewares/fileUpload.middleware');
const { protect, admin } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', diseaseController.getAllDiseases);
router.get('/:id', diseaseController.getDiseaseById);

// Admin only routes
router.post('/', protect, admin, uploadDiseaseImages, diseaseController.createDisease);
router.put('/:id', protect, admin, uploadDiseaseImages, diseaseController.updateDisease);
router.delete('/:id', protect, admin, diseaseController.deleteDisease);

module.exports = router;