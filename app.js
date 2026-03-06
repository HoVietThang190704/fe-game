const express = require('express');
const app = express();

// view engine setup
app.set('view engine', 'ejs');
// our templates live under src/views now
app.set('views', __dirname + '/src/views');

// static files
app.use(express.static(__dirname + '/public'));  // public directory remains at project root

// routes
const homeRouter = require('./src/routes/home');
app.use('/', homeRouter);

const categoryRoutes = require('./src/routes/category');
app.use('/category', categoryRoutes);

// ensure tables exist (code‑first approach)
const { init } = require('./src/initDb');

const PORT = process.env.PORT || 3000;

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('failed to initialize database', err);
    process.exit(1);
  });