const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },     // 'description' அல்ல, 'content'
  category: { type: String },
  author: { type: String },
  status: { type: String },
  imageUrl: { type: String },                    // 'image' அல்ல, 'imageUrl'
  videoUrl: { type: String },
  publishedAt: { type: Date },
}, { timestamps: true });

// 'generalinfos' என்ற Collection-ஐ பயன்படுத்த வேண்டும்
module.exports = mongoose.model('Article', articleSchema, 'generalinfos');