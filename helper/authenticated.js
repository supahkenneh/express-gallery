'use strict';

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('AUTHENTICATED!!!!!!!!!');
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;