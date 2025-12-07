const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    /**
     * CORRECTED DESTINATION FUNCTION
     * 1. Define the path for uploads.
     * 2. Ensure the directory exists.
     * 3. Call the callback (cb) ONLY ONCE with the correct path.
     */
    destination: function (req, file, cb) {
        const uploadPath = 'public/uploads/';
        // Ensure the upload path exists
        fs.mkdirSync(uploadPath, { recursive: true });
        // Tell multer where to save the files
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Central multer instance with size limits and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // 15 MB limit
    fileFilter: fileFilter
});

// Specific uploaders for different routes
const uploadFertilizerImages = upload.fields([
    { name: 'generalImages', maxCount: 5 },
    { name: 'preparationImages', maxCount: 10 },
    { name: 'applicationImages', maxCount: 10 }
]);
const uploadDiseaseImages = upload.array('symptomImages', 10);
const uploadMaintenanceImages = upload.array('images', 10);
const uploadGeneralInfoImage = upload.single('imageUrl');
const uploadArticleImage = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Export all the configured uploaders
module.exports = {
    uploadFertilizerImages,
    uploadDiseaseImages,
    uploadMaintenanceImages,
    uploadGeneralInfoImage,
    uploadArticleImage,
};