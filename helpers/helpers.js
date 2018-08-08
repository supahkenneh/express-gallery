function isAuthenticated(req, res, next) {
  console.log('Authenticating');
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  isAuthenticated
}