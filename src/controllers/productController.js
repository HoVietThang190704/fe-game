/**
 * Product Controller
 * Xử lý logic nghiệp vụ cho tính năng thêm / quản lý sản phẩm
 */
const productModel = require('../models/productModel');

// [GET] /products - Danh sách sản phẩm
exports.index = async (req, res) => {
  try {
    const products = await productModel.getAll();
    res.render('products/index', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// [GET] /products/add - Form thêm sản phẩm
exports.showAddForm = async (req, res) => {
  res.render('products/add', { error: null });
};

// [POST] /products/add - Xử lý thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { name, price, category_id } = req.body;
  try {
    if (!name || !price) {
      return res.render('products/add', { error: 'Tên và giá sản phẩm không được để trống.' });
    }
    await productModel.create({ name, price, category_id });
    res.redirect('/products');
  } catch (err) {
    res.render('products/add', { error: err.message });
  }
};
