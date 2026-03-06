const productModel = require('../models/productModel');

exports.index = async (req, res) => {
  try {
    const products = await productModel.getAll();
    res.render('products/index', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.showAddForm = async (req, res) => {
  res.render('products/add', { error: null });
};

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
