const path = require('path');
const CropMaintenance = require('../models/cropMaintenance.model');

const normalizePath = (value) => value.replace(/\\/g, '/');
const collectUploadedImages = (files = []) =>
    files.map((file) => normalizePath(path.join('/uploads', file.filename)));

const parseJsonArray = (value, fallback = []) => {
    const fallbackArray = Array.isArray(fallback) ? fallback : [];
    if (value === undefined || value === null) {
        return fallbackArray;
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            // ignore JSON parse errors
        }
    }
    return fallbackArray;
};

// @desc    Create a new maintenance
// @route   POST /api/v1/maintenance
// @access  Private/Admin
exports.createMaintenance = async (req, res) => {
    try {
        const { cropType, cropName, season, growthStage, activity, reason, recommendedFertilizers } = req.body;

        const images = collectUploadedImages(req.files || []);

        const maintenance = await CropMaintenance.create({
            cropType, cropName, season, growthStage, activity, reason, recommendedFertilizers, images
        });
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ message: 'Maintenance Creation Failed', error: error.message });
    }
};

// @desc    Get All Maintenance
// @route   GET /api/v1/maintenance
// @access  Public
exports.getAllMaintenance = async (req, res) => {
    try {
        const maintenances = await CropMaintenance.find({});
        res.json(maintenances);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    ID for get a maintenance
// @route   GET /api/v1/maintenance/:id
// @access  Public
exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await CropMaintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Mainatence Not found' });
        }
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Maintenance Update
// @route   PUT /api/v1/maintenance/:id
// @access  Private/Admin
exports.updateMaintenance = async (req, res) => {
    try {
        const maintenance = await CropMaintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance not found' });
        }

        const {
            cropType,
            cropName,
            season,
            growthStage,
            activity,
            reason,
            recommendedFertilizers,
            existingImages
        } = req.body;

        const preservedImages = parseJsonArray(existingImages, maintenance.images).map(normalizePath);
        const uploadedImages = collectUploadedImages(req.files || []);
        maintenance.images = [...preservedImages, ...uploadedImages];

        if (cropType !== undefined) maintenance.cropType = cropType;
        if (cropName !== undefined) maintenance.cropName = cropName;
        if (season !== undefined) maintenance.season = season;
        if (growthStage !== undefined) maintenance.growthStage = growthStage;
        if (activity !== undefined) maintenance.activity = activity;
        if (reason !== undefined) maintenance.reason = reason;
        if (recommendedFertilizers !== undefined) {
            maintenance.recommendedFertilizers = recommendedFertilizers;
        }

        const updated = await maintenance.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Cant Update Maintenance', error: error.message });
    }
};

// @desc    Maintenance Deteletion
// @route   DELETE /api/v1/maintenance/:id
// @access  Private/Admin
exports.deleteMaintenance = async (req, res) => {
    try {
        const maintenance = await CropMaintenance.findByIdAndDelete(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance not found' });
        }
        res.json({ message: 'Maintenance deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};