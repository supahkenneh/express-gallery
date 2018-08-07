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
      .then(photos => {
        return res.json(photos);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

module.exports = router;
