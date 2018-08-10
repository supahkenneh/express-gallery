const express = require('express');
const router = express.Router();

const helpers = require('../helpers/helpers');
const Gallery = require('../db/models/Gallery');

// router.use(helpers.isAuthenticated);

router.route('/')
  .post(helpers.isAuthenticated, (req, res) => {
    let {
      title,
      author,
      link,
      description
    } = req.body;
    let author_name = req.user.username;
    author = author.trim();
    link = link.trim().toLowerCase();
    if (author.length < 1) {
      req.flash('msg4', 'author name required')
      return res.redirect('/gallery/new')
    }
    return new Gallery({ author_name, title, author, link, description })
      .save()
      .then(photo => {
        return res.redirect('/gallery')
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })
  .get((req, res) => {
    return Gallery
      .fetchAll()
      .then(gallery => {
        let firstPic = gallery.models;
        let remainingPics = gallery.models.splice(1);
        return res.render('./gallerypages/index', {
          firstpic: firstPic[0],
          gallery: remainingPics,
          username: req.user.username,
          message: req.flash('msg3')
        });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/new')
  .get(helpers.isAuthenticated, (req, res) => {
    return res.render('./gallerypages/new', {
      message: req.flash('msg4'),
      username: req.user.username
    });
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    if (isNaN(Number(id))) {
      req.flash('msg3', `image doesn't exist`)
      return res.redirect('/gallery');
    }
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(photo => {
        if (!photo.models[0]) {
          req.flash('msg3', `image doesn't exist`)
          return res.redirect('/gallery');
        }
        return res.render('./gallerypages/photo', {
          photo: photo.models[0]
        });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })
  .put(helpers.isAuthenticated, (req, res) => {
    const id = req.params.id;
    let {
      title,
      link,
      description
    } = req.body;
    return new Gallery({ id })
      .save({
        title,
        link,
        description
      })
      .then(edited => {
        console.log(edited);
        req.flash('success', 'image updated')
        return res.redirect(`/gallery/${id}`)
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })
  .delete(helpers.isAuthenticated, (req, res) => {
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
  .get(helpers.isAuthenticated, (req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetch()
      .then(photo => {
        return res.render('./gallerypages/edit', {
          photo: photo.attributes,
          message: req.flash('msg4'),
          username: req.user.username
        })
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

module.exports = router;