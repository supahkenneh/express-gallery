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
    username: user.username.toLowerCase()
  });
});

passport.deserializeUser((user, done) => {
  // console.log('deserialize, ', user)
  new User({ id: user.id }).fetch()
    .then(user => {
      if (!user) {
        return done(null, false);
      } else {
        user = user.toJSON();
        return done(null, {
          id: user.id,
          username: user.username.toLowerCase()
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
    res.render('../views/authpages/register', {
      message: req.flash('registerError'),
      username: req.flash('username'),
      name: req.flash('name'),
      email: req.flash('email')
    });
  })
  .post((req, res) => {
    let {
      username,
      name,
      email
     } = req.body;
     req.flash('username', username);
     req.flash('name', name);
     req.flash('email', email);
    if (username.length < 1) {
      req.flash('registerError', 'username required for registration')
      return res.redirect('/register');
    } else if (req.body.password.length < 1 ) {
      req.flash('registerError', 'password required for registration');
      return res.redirect('/register');
    }
    bcrypt.genSalt(saltedRounds, (err, salt) => {
      if (err) { return res.status(500); }
      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) { return res.status(500); }
        return new User({
          username: req.body.username.toLowerCase(),
          password: hashedPassword
        })
          .save()
          .then(user => {
            req.flash('msg1', 'successfully registered, please login');
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
            req.flash('msg2', 'username already exists');
            return res.render('../views/authpages/register', {
              message: req.flash('msg2')
            });
          });
      })
    })
  });

router.post('/login', (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      req.flash('error', `wrong username or password`);
      return res.redirect('/login')
    } else if (!user) {
        req.flash('error', `wrong username or password`);
        return res.redirect('/login')
    } else if (req.body.username < 1 || req.body.password.length < 1) {
      req.flash('error', `wrong username or password`);
      return res.redirect('/login')
    }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/gallery');
    });
  })(req, res, next);
});


router.get('/login', (req, res) => {
  return res.render('../views/authpages/login', {
    message: req.flash('error')
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.render('./authpages/logout')
});

module.exports = router;
