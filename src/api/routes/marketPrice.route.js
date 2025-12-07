const express = require('express');
const router = express.Router();
const marketPriceController = require('../controllers/marketPrice.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.route('/')
    .get(marketPriceController.getAllMarketPrices)
    .post(protect, admin, marketPriceController.createMarketPrice);

router.route('/:id')
    .get(marketPriceController.getMarketPriceById)
    .put(protect, admin, marketPriceController.updateMarketPrice)
    .delete(protect, admin, marketPriceController.deleteMarketPrice);

module.exports = router;