const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', (req, res) => {
  res.redirect('/');
});

router.post('/register', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;
