const jwt = require('jsonwebtoken');
const User = require('../api/models/auth.model');

// middleware to protect routes and ensure user is authenticated
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if this is a Super Admin token
            if (decoded.id === 'SUPER_ADMIN' && decoded.isSuperAdmin) {
                // Super Admin - create a mock user object
                req.user = {
                    _id: 'SUPER_ADMIN',
                    name: 'Super Admin',
                    email: process.env.SUPER_ADMIN_EMAIL,
                    role: 'superadmin',
                    isSuperAdmin: true
                };
                return next();
            }
            
            // Regular user - fetch from database
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// middleware to check if the user has admin role (including Super Admin)
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.isSuperAdmin)) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// exporting the middleware functions
module.exports = { protect, admin };