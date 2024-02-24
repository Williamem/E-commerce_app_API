const { db } = require('./database');
const { dataTypes } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use(new LocalStrategy({
      usernameField: 'email'
      },
      (email, password, done) => {
        // Match User
        User.findOne({
          where: {email: email}
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'Email is not registered' });
          }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      })
    })
  })
 );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
    .then(user => {
      done(null, user)
    });
  });
};