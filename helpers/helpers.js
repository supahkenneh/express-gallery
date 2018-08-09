const db = require('../db/knex');

//authenticates user for every route past login
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  isAuthenticated,
}