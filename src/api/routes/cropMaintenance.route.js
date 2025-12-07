const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/cropMaintenance.controller');
const { uploadMaintenanceImages } = require('../../middlewares/fileUpload.middleware');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.route('/')
    .get(maintenanceController.getAllMaintenance)
    .post(protect, admin, uploadMaintenanceImages, maintenanceController.createMaintenance);

router.route('/:id')
    .get(maintenanceController.getMaintenanceById)
    .put(protect, admin, uploadMaintenanceImages, maintenanceController.updateMaintenance)
    .delete(protect, admin, maintenanceController.deleteMaintenance);

module.exports = router;