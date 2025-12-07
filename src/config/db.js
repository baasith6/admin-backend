// src/config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // .env கோப்பில் உள்ள மாறிகளைப் பயன்படுத்த

const connectDB = async () => {
  try {
    // .env கோப்பில் உள்ள MONGODB_URI-ஐப் பயன்படுத்தி இணைக்கவும்
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // இணைப்பு தோல்வியுற்றால், செயலியை நிறுத்தவும்
    process.exit(1);
  }
};

// இந்த connectDB செயல்பாட்டை மற்ற கோப்புகள் பயன்படுத்த export செய்யவும்
module.exports = connectDB;