const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products LIMIT 10');
    // always pass an `error` property so the view can safely reference it
    res.render('index', { products: rows, error: null });
  } catch (err) {
    res.render('index', { products: [], error: err.message });
  }
});

module.exports = router;