const router = require('express').Router();

const User = require('../db/models/User');
const Gallery = require('../db/models/Gallery');

const helpers = require('../helpers/helpers');

router.use(helpers.isAuthenticated);

router.get('/', (req, res) => {
  res.redirect('/gallery');
});

router.get('/:user', (req, res) => {
  const user = req.params.user;
  return Gallery
    .query({ where: { author_name: user } })
    .fetchAll()
    .then(photo => {
      if (photo.length < 1) {
        req.flash('msg3', `this user doesn't exist`)
        return res.redirect('/gallery');
      }
      return res.render('./gallerypages/userphotos', {
        user,
        photos: photo.models,
        username: req.user.username
      })
    })
})

module.exports = router;