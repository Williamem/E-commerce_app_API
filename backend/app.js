const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')

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

// Routes
// app.use('/users', userRoutes);
// app.use('/admins', adminRoutes);
// app.use('/products', productRoutes);
// app.use('/cart', cartRoutes);
// ... use other routes

app.get('/', (req, res) => {
    res.send("Welcome to our E-commerce API!");
});

app.use(errorHandler);

module.exports = app;