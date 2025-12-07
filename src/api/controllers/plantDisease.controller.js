const path = require('path');
const PlantDisease = require('../models/plantDisease.model');

const normalizePath = (value) => value.replace(/\\/g, '/');

const toUploadsPath = (filename) => normalizePath(path.join('/uploads', filename));

const parseArrayField = (value, fallback = []) => {
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
            // ignore JSON parse error and fallback to splitting
        }
        return value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => !!item);
    }

    return fallbackArray;
};

const collectUploadedImages = (files = []) =>
    files.map((file) => toUploadsPath(file.filename));

// @desc   Create a new disease
// @route   POST /api/v1/diseases
// @access  Private/Admin
exports.createDisease = async (req, res) => {
    try {
        const {
            cropType,
            cropName,
            diseaseName,
            affectedPart,
            symptoms,
            causes,
            chemicalSolutions,
            naturalSolutions
        } = req.body;

        const symptomImages = collectUploadedImages(req.files || []);

        const disease = await PlantDisease.create({
            cropType,
            cropName,
            diseaseName,
            affectedPart,
            symptoms,
            causes,
            chemicalSolutions: parseArrayField(chemicalSolutions),
            naturalSolutions: parseArrayField(naturalSolutions),
            symptomImages
        });
        res.status(201).json(disease);
    } catch (error) {
        res.status(400).json({ message: 'தாவர நோயை உருவாக்க முடியவில்லை', error: error.message });
    }
};

// @desc    Idindy Get All Diseases
// @route   GET /api/v1/diseases
// @access  Public
exports.getAllDiseases = async (req, res) => {
    try {
        const diseases = await PlantDisease.find({});
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc   ID For get a disease
// @route   GET /api/v1/diseases/:id
// @access  Public
exports.getDiseaseById = async (req, res) => {
    try {
        const disease = await PlantDisease.findById(req.params.id);
        if (!disease) {
            return res.status(404).json({ message: 'Diseses Not Found' });
        }
        res.json(disease);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc   Update a disease
// @route   PUT /api/v1/diseases/:id
// @access  Private/Admin
exports.updateDisease = async (req, res) => {
    try {
        const disease = await PlantDisease.findById(req.params.id);
        if (!disease) {
            return res.status(404).json({ message: 'Diseses Not Found' });
        }

        const {
            cropType,
            cropName,
            diseaseName,
            affectedPart,
            symptoms,
            causes,
            chemicalSolutions,
            naturalSolutions,
            existingSymptomImages
        } = req.body;

        const currentChemicalSolutions = parseArrayField(disease.chemicalSolutions);
        const currentNaturalSolutions = parseArrayField(disease.naturalSolutions);

        const preservedImages = parseArrayField(existingSymptomImages, disease.symptomImages).map(normalizePath);
        const newImages = collectUploadedImages(req.files || []);
        disease.symptomImages = [...preservedImages, ...newImages];

        if (cropType !== undefined) disease.cropType = cropType;
        if (cropName !== undefined) disease.cropName = cropName;
        if (diseaseName !== undefined) disease.diseaseName = diseaseName;
        if (affectedPart !== undefined) disease.affectedPart = affectedPart;
        if (symptoms !== undefined) disease.symptoms = symptoms;
        if (causes !== undefined) disease.causes = causes;
        if (chemicalSolutions !== undefined) {
            disease.chemicalSolutions = parseArrayField(chemicalSolutions, currentChemicalSolutions);
        } else {
            disease.chemicalSolutions = currentChemicalSolutions;
        }
        if (naturalSolutions !== undefined) {
            disease.naturalSolutions = parseArrayField(naturalSolutions, currentNaturalSolutions);
        } else {
            disease.naturalSolutions = currentNaturalSolutions;
        }

        const updated = await disease.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Cant Upadate Disease', error: error.message });
    }
};

// @desc    Delete a disease
// @route   DELETE /api/v1/diseases/:id
// @access  Private/Admin
exports.deleteDisease = async (req, res) => {
    try {
        const disease = await PlantDisease.findById(req.params.id);
        if (!disease) {
            return res.status(404).json({ message: 'Diseses Not Found' });
        }
        await PlantDisease.findByIdAndDelete(req.params.id);

        res.json({ message: 'Diseses Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};