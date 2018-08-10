const express = require('express');
const router = express.Router();

const helpers = require('../helpers/helpers');
const Gallery = require('../db/models/Gallery');
router.route('/')
  .post(helpers.isAuthenticated, (req, res) => {
    let {
      title,
      link,
      description
    } = req.body;
    let author_name = req.user.username;
    author = req.user.username;
    link = link.trim().toLowerCase();
    if (author.length < 1) {
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
        if (!req.user) {
          return res.render('./gallerypages/index', {
            firstpic: firstPic[0],
            gallery: remainingPics,
            registration: true
          })
        }
        return res.render('./gallerypages/index', {
          firstpic: firstPic[0],
          gallery: remainingPics,
          username: req.user.username,
        });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/new')
  .get(helpers.isAuthenticated, (req, res) => {
    return res.render('./gallerypages/new', {
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
          photo: photo.models[0],
          message: req.flash('error'),
          username: true
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
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(result => {
        if (req.user.username !== result.models[0].attributes.author) {
          req.flash('error', `you don't have rights to edit this`);
          return res.redirect(`/gallery/${id}/edit`)
        }
        return new Gallery({ id })
          .save({
            title,
            link,
            description
          })
          .then(edited => {
            req.flash('success', 'image updated')
            return res.redirect(`/gallery/${id}`)
          })
          .catch(err => {
            return res.json({ message: err.message });
          });
      })
  })
  .delete(helpers.isAuthenticated, (req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(result => {
        if (req.user.username !== result.models[0].attributes.author) {
          req.flash('error', `you don't have the rights to delete this image`)
          return res.redirect(`/gallery/${id}`)
        }
        return new Gallery({ id })
          .destroy()
          .then(result => {
            return res.redirect('/gallery');
          })
          .catch(err => {
            return res.json({ message: err.message });
          });
      })
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
          message: req.flash('error'),
          username: req.user.username
        })
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

module.exports = router;