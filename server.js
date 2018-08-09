'use strict';

const express = require('express');
const session = require('express-session');
const Redis = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const hiddenMethodParser = require('./helper/hiddenMethodParser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const saltedRounds = 12;

const PORT = process.env.PORT || 15000;
const User = require('./db/models/User');
const app = express();
const routes = require('./routes');
const isAuthenticated = require('./helper/authenticated');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  methodOverride((req, res) => {
    return hiddenMethodParser(req, res);
  })
);

app.use(
  session({
    store: new Redis(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User({ id: user.id })
    .fetch()
    .then(user => {
      if (!user) {
        throw new Error('User not logged in ');
      }
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch(err => {
      return done(err);
    });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch({ require: true })
      .then(user => {
        user = user.toJSON();
        console.log(user);
        if (user === null) {
          return done(null, false, { message: 'bad username or password' });
        } else {
          console.log(password, user.password);
          bcrypt.compare(password, user.password).then(samePassword => {
            if (samePassword) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'bad username or password' });
            }
          });
        }
      })
      .catch(err => {
        console.log('error: ', err);
        return done(err);
      });
  })
);

app.set('view engine', '.hbs');

app.get('/register', (req, res) => {
  res.render('./users/new');
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltedRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      console.log('Hashed password:', hashedPassword);
      if (err) {
        return res.status(500);
      }
      return new User({
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name,
        email: req.body.email
      })
        .save()
        .then(user => {
          console.log(user);
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          return res.send('Could not register you');
        });
    });
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    // console.log('ERROR:', err);
    // console.log('USER:', user);
    // console.log('INFO:', info);
    // console.log('username: ', req.body.username);
    // console.log('password: ', req.body.password);

    if (err) {
      req.flash('error', {message:'Incorrect username or password'});
      req.flash('username', req.body.username);
      // console.log(err);
      return res.status(404).redirect('/login');
    }

    if (!user) {
      if (!req.body.username.length) {
        req.flash('error', { username: 'Fill in the username' });
      }
      if (!req.body.password.length) {
        req.flash('error', { password: 'Fill in the password' });
      }
      req.flash('username', req.body.username);
      return res.status(400).redirect('/login');
    }

    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.user.username: ', req.user.username);
  res.send('you found the secret!');
});

app.get('/login', (req, res) => {
  res.render('./users/login', {
    reasons: req.flash('error'),
    username: req.flash('username')
  });
});

app.use('/', routes);

app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port: ${PORT}`);
});
