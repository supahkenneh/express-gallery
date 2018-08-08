const express = require('express');
const router = express.Router();
const helpers = require('../helpers/helpers');

const Gallery = require('../db/models/Gallery');

router.use(helpers.isAuthenticated);

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
        return res.render('./gallerypages/index', { gallery: gallery.models });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/new')
  .get((req, res) => {
    return res.render('./gallerypages/new');
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
  })
  .put((req, res) => {
    const id = req.params.id;
    let {
      author,
      link,
      description
    } = req.body;
    return new Gallery({ id })
      .save({
        author,
        link,
        description
      })
      .then(edited => {
        return res.json(edited)
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })
  .delete((req, res) => {
    const id = req.params.id;
    return new Gallery({ id })
      .destroy()
      .then(result => {
        return res.redirect('/gallery');
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/:id/edit')
  .get((req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetch()
      .then(photo => {
        return res.render('./gallerypages/edit', {
          photo: photo.attributes,
        })
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

module.exports = router;