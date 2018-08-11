const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/helpers');
const Gallery = require('../db/models/Gallery');

router.route('/')
  .post(isAuthenticated, (req, res) => {
    let {
      title,
      link,
      description
    } = req.body;
    let author_name = req.user.username;
    author = req.user.username;
    link = link.trim().toLowerCase();
    if (title.length < 1) {
      req.flash('msg', 'title required')
      req.flash('photo', req.body)
      return res.redirect('/gallery/new')
    }
    return new Gallery({ author_name, title, author, link, description })
      .save()
      .then(() => {
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
            registration: true,
            message: req.flash('msg')
          })
        }
        return res.render('./gallerypages/index', {
          firstpic: firstPic[0],
          gallery: remainingPics,
          username: req.user.username,
          message: req.flash('msg')
        });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/new')
  .get(isAuthenticated, (req, res) => {
    return res.render('./gallerypages/new', {
      message: req.flash('msg'),
      username: req.user.username,
      photo: req.flash('photo')
    });
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    let showSidebar = false;
    if (isNaN(Number(id))) {
      req.flash('msg', `image doesn't exist`)
      return res.redirect('/gallery');
    }
    if(req.user) {
      showSidebar = true;
    } 
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(photo => {
        if (!photo.models[0]) {
          req.flash('msg', `image doesn't exist`)
          return res.redirect('/gallery');
        }
        return res.render('./gallerypages/photo', {
          photo: photo.models[0],
          message: req.flash('msg'),
          username: showSidebar
        });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
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
        return new Gallery({ id })
          .save({ title, link, description })
      })
      .then(() => {
        req.flash('msg', 'image updated')
        return res.redirect(`/gallery/${id}`)
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })

  .delete(isAuthenticated, (req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetchAll()
      .then(result => {
        if (req.user.username !== result.models[0].attributes.author) {
          req.flash('msg', `you don't have the rights to delete this image`)
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
  .get(isAuthenticated, (req, res) => {
    const id = req.params.id;
    return Gallery
      .query({ where: { id } })
      .fetch()
      .then(result => {
        if (req.user.username !== result.attributes.author_name) {
          req.flash('msg', `you don't have the rights to edit this image`)
          return res.redirect(`/gallery/${id}`)
        }
        return res.render('./gallerypages/edit', {
          photo: result.attributes,
          message: req.flash('msg'),
          username: req.user.username
        })
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

module.exports = router;