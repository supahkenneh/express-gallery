'use strict';

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('AUTHENTICATED!!!!!!!!!');
    next();
  } else {
    res.app.locals.error = {message : 'Please sign in'};
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;