const path = require('path');
const GeneralInfo = require('../models/generalInfo.model');

const normalizePath = (value = '') => value.replace(/\\/g, '/');
const toUploadsPath = (filename = '') => normalizePath(path.join('/uploads', filename));

const resolveImagePath = (value) => {
    if (!value) {
        return undefined;
    }
    if (typeof value === 'string' && value.startsWith('http')) {
        return value;
    }
    const normalized = normalizePath(
        typeof value === 'string' ? (value.startsWith('/') ? value : `/${value}`) : ''
    );
    if (normalized.startsWith('/public/uploads/')) {
        return normalized.replace('/public', '');
    }
    if (normalized.startsWith('public/uploads/')) {
        return normalized.replace(/^public/, '');
    }
    if (normalized.startsWith('/uploads/')) {
        return normalized;
    }
    if (normalized.startsWith('uploads/')) {
        return `/${normalized}`;
    }
    const trimmed = normalized.replace(/^\/+/, '');
    return toUploadsPath(trimmed);
};

// @desc    புதிய கட்டுரையை உருவாக்குதல்
// @route   POST /api/v1/articles
// @access  Private/Admin
exports.createArticle = async (req, res) => {
    try {
        const { title, content, category, imageUrl, videoUrl, author, status } = req.body;
        
        let finalImageUrl = resolveImagePath(imageUrl);
        if (req.files && req.files.image && req.files.image.length > 0) {
            finalImageUrl = toUploadsPath(req.files.image[0].filename);
        }

        const finalStatus = status === 'published' ? 'published' : 'draft';
        const publishedAt = finalStatus === 'published' ? new Date() : null;

        const article = await GeneralInfo.create({
            title,
            content,
            category: category || 'Article',
            author,
            status: finalStatus,
            publishedAt,
            imageUrl: finalImageUrl,
            videoUrl
        });
        
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: 'கட்டுரையை உருவாக்க முடியவில்லை', error: error.message });
    }
};

// @desc    அனைத்து கட்டுரைகளையும் பெறுதல்
// @route   GET /api/v1/articles
// @access  Public
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await GeneralInfo.find({
            category: { $in: ['Article', 'SuccessStory'] }
        }).sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    ID மூலம் ஒரு கட்டுரையைப் பெறுதல்
// @route   GET /api/v1/articles/:id
// @access  Public
exports.getArticleById = async (req, res) => {
    try {
        const article = await GeneralInfo.findOne({
            _id: req.params.id,
            category: { $in: ['Article', 'SuccessStory'] }
        });
        if (!article) {
            return res.status(404).json({ message: 'கட்டுரை கிடைக்கவில்லை' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    ஒரு கட்டுரையைப் புதுப்பித்தல்
// @route   PUT /api/v1/articles/:id
// @access  Private/Admin
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, category, imageUrl, videoUrl, author, status } = req.body;
        
        let finalImageUrl = resolveImagePath(imageUrl);
        if (req.files && req.files.image && req.files.image.length > 0) {
            finalImageUrl = toUploadsPath(req.files.image[0].filename);
        }

        const article = await GeneralInfo.findOne({
            _id: req.params.id,
            category: { $in: ['Article', 'SuccessStory'] }
        });

        if (!article) {
            return res.status(404).json({ message: 'கட்டுரை கிடைக்கவில்லை' });
        }

        const updateData = { title, content };
        if (category) updateData.category = category;
        if (author) updateData.author = author;
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;
        if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

        if (status) {
            const finalStatus = status === 'published' ? 'published' : 'draft';
            updateData.status = finalStatus;
            updateData.publishedAt =
                finalStatus === 'published' ? article.publishedAt || new Date() : null;
        }

        const updated = await GeneralInfo.findByIdAndUpdate(article._id, updateData, {
            new: true,
            runValidators: true,
        });
        
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'புதுப்பிக்க முடியவில்லை', error: error.message });
    }
};

// @desc    ஒரு கட்டுரையை நீக்குதல்
// @route   DELETE /api/v1/articles/:id
// @access  Private/Admin
exports.deleteArticle = async (req, res) => {
    try {
        const article = await GeneralInfo.findOneAndDelete({
            _id: req.params.id,
            category: { $in: ['Article', 'SuccessStory'] }
        });
        if (!article) {
            return res.status(404).json({ message: 'கட்டுரை கிடைக்கவில்லை' });
        }
        res.json({ message: 'கட்டுரை நீக்கப்பட்டது' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

