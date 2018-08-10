const router = require('express').Router();

const User = require('../db/models/User');
const Gallery = require('../db/models/Gallery');

router.get('/', (req, res) => {
  res.redirect('/gallery');
});

router.get('/:user', (req, res) => {
  if (!req.user) {
    username = ''
  } else {
    username = req.user.username
  }
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
        username,
      })
    })
})

module.exports = router;