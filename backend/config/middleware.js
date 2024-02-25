const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');


const setupMiddleware = (app) => {
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = setupMiddleware;