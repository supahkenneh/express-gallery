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
const PORT = process.env.PORT || 15000;

const app = express();
const routes = require('./routes');

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

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, document) => {
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
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
        user = user.toJSON();
        console.log(user);
        if (user === null) {
          return done(null, false, { message: 'bad username or password' });
        } else {
          console.log(password, user.password);
          if (password === user.password) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'bad username or password' });
          }
        }
      })
      .catch(err => {
        console.log('error: ', err);
        return done(err);
      });
  })
);

app.set('view engine', '.hbs');

app.post('/register', (req, res) => {
  return new User({
    username: req.body.username,
    password: req.body.password,
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

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/'
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

app.use('/', routes);

app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port: ${PORT}`);
});
