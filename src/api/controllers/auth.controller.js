const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token will be valid for 30 days
  });
};

// Helper function to generate a token for Super Admin (using special identifier)
const generateSuperAdminToken = () => {
  return jwt.sign({ id: 'SUPER_ADMIN', isSuperAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (checks Super Admin first, then database)
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Step 1: Check if credentials match Super Admin from .env
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (email === superAdminEmail && password === superAdminPassword) {
      // Super Admin login successful
      return res.json({
        _id: 'SUPER_ADMIN',
        name: 'Super Admin',
        email: superAdminEmail,
        role: 'superadmin',
        token: generateSuperAdminToken(),
      });
    }

    // Step 2: If not Super Admin, check database for regular admin/user
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin (Protected route - only logged-in users can access)
// @route   POST /api/v1/auth/register-admin
// @access  Private (Protected by auth middleware)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide name, email, and password" 
      });
    }

    // Check if admin with this email already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ 
        message: "Admin with this email already exists" 
      });
    }

    // Create new admin with role 'admin'
    // The password will be automatically hashed by the pre-save hook in the model
    const admin = await User.create({ 
      name, 
      email, 
      password, 
      role: 'admin' 
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        message: "Admin created successfully"
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, registerAdmin };
