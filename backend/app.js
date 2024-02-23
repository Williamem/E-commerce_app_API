const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const passportSetup = require('./config/passport');
const { db } = require('./config/database')

const errorHandler = require('./middleware/errorHandler')

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
// ... import other routes

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

passportSetup(passport);


// Routes
app.use('/users', userRoutes);
// app.use('/admin', adminRoutes);
// app.use('/products', productRoutes);
// app.use('/cart', cartRoutes);
// ... other routes

app.get('/', (req, res) => {
    res.send("Welcome to our E-commerce API!");
});

app.use(errorHandler);

// Sync all models
// remove in production
db.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((error) => {
    console.log('Unable to sync the models:', error);
  });

module.exports = app;