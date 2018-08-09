const express = require('express')
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../db/models/User');
const bcrypt = require('bcrypt');
const saltedRounds = 12;


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
        bcrypt.compare(password, user.password)
          .then(samePassword => {
            if (samePassword) { return done(null, user); }
            else {
              return done(null, false, { message: 'bad username or password' });
            }
          })
      }
    })
    .catch(err => {
      return done(err);
    });
}));

router.get('/', (req, res) => {
  res.render('landingpage');
});

router.route('/register')
  .get((req, res) => {
    res.render('../views/authpages/register');
  })
  .post((req, res) => {
    bcrypt.genSalt(saltedRounds, (err, salt) => {
      if (err) { return res.status(500); }
      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) { return res.status(500); }
        return new User({
          username: req.body.username,
          password: hashedPassword
        })
          .save()
          .then(user => {
            req.flash('msg1', 'successfully registered, please login')
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
            return res.render('../views/authpages/register', {
              message: 'username already exists'
            });
          });
      })
    })
  });

router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/login'
  }))
  .get((req, res) => {
    return res.render('../views/authpages/login', {
      message: req.flash('msg1')
    });
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.render('./authpages/logout')
});

module.exports = router;
