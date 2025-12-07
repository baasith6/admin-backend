const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { uploadArticleImage } = require('../../middlewares/fileUpload.middleware');
const { protect, admin } = require('../../middlewares/auth.middleware');

// முக்கியம்: உங்கள் ஃபோல்டர் அமைப்பிற்கு ஏற்ப இது '../models/Article' அல்லது '../../models/Article' ஆக இருக்கலாம். 
// பொதுவாக 'src/api/routes' இல் இருந்தால், மாடல் 'src/api/models' இல் இருந்தால் '../models/Article' சரி.
const Article = require('../models/Article'); 

// 1. Get Latest 4 Articles (இதுதான் நாம் புதிதாகச் சேர்த்தது)
// இது எப்போதும் '/:id' ரவுட்டுக்கு மேலே இருக்க வேண்டும்.
router.get('/latest', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(4);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/:id', articleController.getArticleById);
// Admin only routes
router.post('/', protect, admin, uploadArticleImage, articleController.createArticle);
router.put('/:id', protect, admin, uploadArticleImage, articleController.updateArticle);
router.delete('/:id', protect, admin, articleController.deleteArticle);

module.exports = router;