let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let db = require('../models');

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.user.findByPk(id).then(user => {
    if (user) {
      cb(null, user);
    }
  }).catch(error => {
    console.log(error);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, cb) => {
  db.user.findOne({
    where: { email }
  }).then(user => {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

module.exports = passport;