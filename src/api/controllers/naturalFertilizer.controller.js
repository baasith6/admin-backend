const NaturalFertilizer = require("../models/naturalFertilizer.model");
const path = require("path");

const normalizePath = (value = "") => value.replace(/\\/g, "/");
const toUploadsPath = (filename = "") =>
  normalizePath(path.join("/uploads", filename));

const ensureUploadsPath = (value = "") => {
  const normalized = normalizePath(value);
  if (!normalized) return normalized;
  if (normalized.startsWith("/uploads/")) return normalized;
  if (normalized.startsWith("uploads/")) return `/${normalized}`;
  if (normalized.startsWith("/public/uploads/")) {
    return normalized.replace("/public", "");
  }
  if (normalized.startsWith("public/uploads/")) {
    return normalized.replace(/^public/, "");
  }
  const trimmed = normalized.replace(/^\/+/, "");
  return toUploadsPath(trimmed);
};

const cloneArray = (value = []) => (Array.isArray(value) ? [...value] : []);

const parseJsonArray = (value, fallback = []) => {
  const defaultValue = cloneArray(fallback);
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (Array.isArray(value)) {
    return [...value];
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
          return [...parsed];
      }
    } catch (error) {
      // ignore invalid json, will fallback below
    }
  }
  return cloneArray(fallback);
};

const parseExistingImages = (value, fallback = []) =>
  parseJsonArray(value, fallback)
    .map((entry) => ensureUploadsPath(entry))
    .filter((entry) => !!entry);

// @desc    Create a new fertilizer
// @route   POST /api/v1/fertilizers
// @access  Private/Admin
const createFertilizer = async (req, res) => {
  try {
    const {
      name,
      content,
      reasonsForUse,
      dosageAndTiming,
      // jeson data fields
      suitablePlants: suitablePlantsJson,
      preparationMethod: preparationMethodJson,
      applicationMethod: applicationMethodJson,
    } = req.body;

    const suitablePlants = parseJsonArray(suitablePlantsJson);
    const preparationMethod = parseJsonArray(preparationMethodJson);
    const applicationMethod = parseJsonArray(applicationMethodJson);

    const generalImages = req.files?.generalImages
      ? req.files.generalImages.map((file) => toUploadsPath(file.filename))
      : [];

    //preparationmethod Schema  images join
    const fertilizer = new NaturalFertilizer({
      name,
      content,
      reasonsForUse,
      suitablePlants,
      preparationMethod,
      applicationMethod,
      dosageAndTiming,
      generalImages,
    });

    const createdFertilizer = await fertilizer.save();
    res.status(201).json(createdFertilizer);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Can't Add Fertilizers", error: error.message });
  }
};

// @desc   gel all fertilizers
// @route   GET /api/v1/fertilizers
// @access  Public
const getAllFertilizers = async (req, res) => {
  try {
    const fertilizers = await NaturalFertilizer.find({});
    res.json(fertilizers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    id for get a fertilizer
// @route   GET /api/v1/fertilizers/:id
// @access  Public
const getFertilizerById = async (req, res) => {
  try {
    const fertilizer = await NaturalFertilizer.findById(req.params.id);
    if (fertilizer) {
      res.json(fertilizer);
    } else {
      res.status(404).json({ message: "Fertilizer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a fertilizer
// @route   PUT /api/v1/fertilizers/:id
// @access  Private/Admin
const updateFertilizer = async (req, res) => {
  try {
    const fertilizer = await NaturalFertilizer.findById(req.params.id);

    if (!fertilizer) {
      return res.status(404).json({ message: "Fertilizer not found" });
    }
    const {
      name,
      content,
      reasonsForUse,
      dosageAndTiming,
      suitablePlants,
      preparationMethod,
      applicationMethod,
      existingGeneralImages,
    } = req.body;

    const oldImages = parseExistingImages(
      existingGeneralImages,
      fertilizer.generalImages
    );

    const newImages = req.files?.generalImages
      ? req.files.generalImages.map((file) => toUploadsPath(file.filename))
      : [];

    const mergedImages = Array.from(new Set([...oldImages, ...newImages]));

    if (name !== undefined) fertilizer.name = name;
    if (content !== undefined) fertilizer.content = content;
    if (reasonsForUse !== undefined) fertilizer.reasonsForUse = reasonsForUse;
    if (dosageAndTiming !== undefined)
      fertilizer.dosageAndTiming = dosageAndTiming;

    fertilizer.suitablePlants = parseJsonArray(
      suitablePlants,
      fertilizer.suitablePlants
    );
    fertilizer.preparationMethod = parseJsonArray(
      preparationMethod,
      fertilizer.preparationMethod
    );
    fertilizer.applicationMethod = parseJsonArray(
      applicationMethod,
      fertilizer.applicationMethod
    );
    fertilizer.generalImages = mergedImages;

    // Save the updated fertilizer
    const updated = await fertilizer.save();

    // IMPORTANT:must return updated object (not string)
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: "Can't Update Fertilizer",
      error: error.message,
    });
  }
};

// @desc    Delete a fertilizer
// @route   DELETE /api/v1/fertilizers/:id
// @access  Private/Admin
const deleteFertilizer = async (req, res) => {
  try {
    const fertilizer = await NaturalFertilizer.findById(req.params.id);
    if (fertilizer) {
      await NaturalFertilizer.findByIdAndDelete(req.params.id);

      res.json({ message: "Fertilizer deleted" });
    } else {
      res.status(404).json({ message: "Fertilizer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createFertilizer,
  getAllFertilizers,
  getFertilizerById,
  updateFertilizer,
  deleteFertilizer,
};
