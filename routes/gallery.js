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
  })
  .get((req, res) => {
    return Gallery
      .fetchAll()
      .then(gallery => {
        return res.json(gallery);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });
  
router.route('/new')
  .get((req, res) => {
    console.log('hi');
    return res.render('new');
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(photo => {
        return res.json(photo);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });


module.exports = router;