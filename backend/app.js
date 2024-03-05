const express = require('express');

require('dotenv').config();

const User = require('./models/User')

//middleware
const errorHandler = require('./middleware/errorHandler');
const setupMiddleware = require('./config/middleware');
const sync = require('./middleware/sync')

// routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { isAuthenticated } = require('./middleware/authentication')
// ... import other routes

const app = express();

// Middleware
setupMiddleware(app);


// Routes
app.use('/users', userRoutes);

//app.use(isAuthenticated)

app.use('/admin', adminRoutes);
app.use('/products', productRoutes);
app.use('/profile', profileRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
// ... other routes

app.get('/', (req, res) => {
    res.send("Welcome to our E-commerce API!");
});

app.use(errorHandler);

// Sync all models
// remove in production
sync()

module.exports = app;