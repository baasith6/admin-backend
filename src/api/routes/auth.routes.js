const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerAdmin } = require('../controllers/auth.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/v1/auth/login
// @desc    Login a user and get a token
router.post('/login', loginUser);

// @route   POST /api/v1/auth/register-admin
// @desc    Register a new admin (Protected - only logged-in users can access)
// @access  Private (Protected by auth middleware)
router.post('/register-admin', protect, admin, registerAdmin);

module.exports = router;