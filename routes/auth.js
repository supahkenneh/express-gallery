const express = require('express')
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../db/models/User');

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  return done(user);
});

passport.use(new LocalStrategy(function (username, password, done) {
  return new User({ username: username }).fetch()
    .then(user => {
      user = user.toJSON();
      if (user === null) {
        return done(null, false, { message: 'bad username or password' });
      } else {
        if (password === user.password) { return done(null, user); }
        else {
          return done(null, false, { message: 'bad username or password' });
        }
      }
    })
    .catch(err => {
      return done(err);
    });
}));

router.get('/', (req, res) => {
  res.send('render regular page');
});

router.get('/register', (req, res) => {
  res.render('../views/authpages/register');
})

router.post('/register', (req, res) => {
  return new User({
    username: req.body.username,
    password: req.body.password
  })
    .save()
    .then(user => {
      res.redirect('/gallery');
    })
    .catch(err => {
      return res.send('Could not register user');
    });
});

router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/'
  }))
  .get((req, res) => {
    return res.render('../views/authpages/login');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
};

module.exports = router;
