const express = require('express')
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../db/models/User');

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  new User({ id: user.id }).fetch()
    .then(user => {
      if (!user) {
        return done(null, false);
      } else {
        user = user.toJSON();
        return done(null, {
          id: user.id,
          username: user.username
        });
      }
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
  return new User({ username: username }).fetch()
    .then(user => {
      if (user === null) {
        return done(null, false, { message: 'bad username or password' });
      } else {
        user = user.toJSON();
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

router.route('/register')
  .get((req, res) => {
    res.render('../views/authpages/register');
  })
  .post((req, res) => {
    return new User({
      username: req.body.username,
      password: req.body.password
    })
      .save()
      .then(user => {
        res.redirect('/login');
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
  console.log(req);
  req.logout();
  res.sendStatus(200);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
};

module.exports = router;
