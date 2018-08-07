const express = require('express');
const router = express.Router();

const Gallery = require('../db/models/Gallery');

router.route('/')
  .post((req, res) => {
    let {
      author,
      link,
      description
    } = req.body;
    author = author.trim();
    link = link.trim().toLowerCase();
    
    return new Gallery({ author, link, description })
    .save()
    .then(gallery => {
      return res.json(gallery);
    })
    .catch(err => {
      return res.json({ message: err.message });
    });
  });

module.exports = router;