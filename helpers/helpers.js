//authenticates user for every route past login
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

function isOwner(req, res, next) {
}

module.exports = {
  isAuthenticated,
}