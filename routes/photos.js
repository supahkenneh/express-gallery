const express = require('express');
const router = express.Router();
const Photo = require('../db/models/Photo');

router
  .route('/')
  .post((req, res) => {
    let { author_username, link, description } = req.body;
    author_username = author_username.trim();
    link = link.trim().toLowerCase();

    return new Photo({
      author_username,
      link,
      description
    })
      .save()
      .then(photo => {
        return res.json(photo);
      })
      .catch(err => {
        res.send(err);
      });
  })
  .get((req, res) => {
    return Photo.fetchAll()
      .then(result => {
        if (result.length === 0) {
          throw new Error('There are currently no photos.');
        }
        return result.models;
      })
      .then(photos => {
        console.log(photos);

        return res.render('./photos/index', {photos: photos});
      })
      .catch(err => {
        console.log('errors', err);
        return res.render('./photos/index', { errors: err.message });
      });
  });

module.exports = router;
