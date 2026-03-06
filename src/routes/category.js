// src/routes/category.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Xử lý request GET tại đường dẫn gốc của route (sẽ là /category)
router.get('/', categoryController.getCategories);

module.exports = router;