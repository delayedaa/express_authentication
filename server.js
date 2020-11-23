require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
let session = require('express-session');
let passport = require('./config/ppConfig');
let flash = require('connect-flash');
let SECRET_SESSION = process.env.SECRET_SESSION;
const app = express();

// isLoggedIn middleware
let isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// secret: what we actually will be giving the user on our site as a session cookie
// resave: save the session even if it's modified, make this false
// saveUninitialized: if we have a new session, we save it, therefore making that true
let sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionObject));

// Initialize passport and run through middleware
app.use(passport.initialize());
app.use(passport.session());

// Using flash thoughout app to send temp messages to user
app.use(flash());

app.use((req, res, next) => {
  // Before every route, we will attach a user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', { alerts: res.locals.alerts });
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
