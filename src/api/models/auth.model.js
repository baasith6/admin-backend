const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // Each user must have a unique email
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // When we query a user, the password will not be returned by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // The role can only be one of these two values
        default: 'user', // If no role is specified, it will default to 'user'
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

// This function will run BEFORE a user document is saved to the database
userSchema.pre('save', async function (next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash the password with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// This adds a method to the user model to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;