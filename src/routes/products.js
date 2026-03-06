const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.index);
router.get('/add', productController.showAddForm);
router.post('/add', productController.addProduct);
router.get('/:id', productController.detail);

module.exports = router;
