const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
//const passportSetup = require('./config/passport');
require('./config/passport')(passport)
const { db } = require('./config/database')
const session = require('express-session');

require('dotenv').config();

const User = require('./models/User')

//middleware
const errorHandler = require('./middleware/errorHandler')

// routes
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
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/users', userRoutes);


app.post('/login', passport.authenticate('local'), (req, res) => {
    console.dir()
    res.status(200).send({ message: 'Log in successful' });
});


app.get('/logout', (req, res) => {
    req.logout(() => {
        res.send({ message: 'logged out' });
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.user) return next();
    else {
        return res.status(401).json({
            error: 'user not authenticated'
        })
    }
}

app.use(isAuthenticated)

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