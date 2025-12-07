require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./src/config/db");

const app = express();

// --- API Routes Import ---
const authRoutes = require('./src/api/routes/auth.routes');
const naturalFertilizerRoutes = require("./src/api/routes/naturalFertilizer.route");
const plantDiseaseRoutes = require("./src/api/routes/plantDisease.route");
const marketPriceRoutes = require("./src/api/routes/marketPrice.route");
const cropMaintenanceRoutes = require('./src/api/routes/cropMaintenance.route');

// இங்கே இருந்த 'require(.../articles)' வரியை நீக்கிவிட்டேன். 
// பழைய articleRoutes மட்டுமே போதும்.
const articleRoutes = require('./src/api/routes/article.routes');

connectDB();

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.get("/", (req, res) => {
  res.send("Agriதமிழா API is running...");
});

// --- API Routes Definition ---
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/fertilizers", naturalFertilizerRoutes);
app.use('/api/v1/diseases', plantDiseaseRoutes);
app.use('/api/v1/market-prices', marketPriceRoutes);
app.use('/api/v1/maintenance', cropMaintenanceRoutes);

// Article Route
// இது '/api/v1/articles' என்று இருப்பதால், 
// Latest news லிங்க்: http://localhost:3000/api/v1/articles/latest என்று இருக்கும்.
app.use('/api/v1/articles', articleRoutes);

// --- Global Error Handler ---
app.use((error, req, res, next) => {
  console.error("பிழை ஏற்பட்டது:", error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;