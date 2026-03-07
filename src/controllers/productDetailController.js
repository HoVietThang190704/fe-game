const productModel = require('../models/productModel');

exports.showDetail = async (req, res) => {
  try {
    const id = req.params.id;

    // kiểm tra id
    if (!id) {
      return res.status(400).send('ID sản phẩm không hợp lệ.');
    }

    const product = await productModel.getById(id);

    // kiểm tra tồn tại
    if (!product) {
      return res.status(404).render('errors/404', {
        message: 'Sản phẩm không tồn tại'
      });
    }

    res.render('products/productDetail', {
      title: product.name,
      product
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', {
      message: 'Lỗi server'
    });
  }
};