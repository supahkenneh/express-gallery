const express = require('express');
const router = express.Router();
const isAuthenticated = require('../helper/authenticated');
const Photo = require('../db/models/Photo');

router.route('/').post(isAuthenticated,(req, res) => {
  let { author_username, link, description, title } = req.body;
  if (!(author_username.length && link.length && description.length && title.length)) {
    res.app.locals.error = { reason: 'You need to fill in all the fields' };
  }
  author_username = author_username.trim();
  link = link.trim().toLowerCase();
  title = title.trim();

  return new Photo({
    author_username,
    title,
    link,
    description
  })
    .save([require=true])
    .then(photo => {
      if(!photo){
        throw new Error('User not found');
      }
      return res.redirect('/');
    })
    .catch(err => {
      res.app.locals.body = req.body;
      res.redirect('/gallery/new');
    });
});

router.route('/new').get((req, res) => {
  let renderParams = {reason: res.app.locals.error, ...res.app.locals.body};
  res.app.locals.error = '';
  res.app.locals.body = '';
  res.render('./gallery/new', renderParams);
});

router.route('/:id/edit').get((req, res) => {
  return Photo.where('id', req.params.id)
    .fetch([{ require: true }])
    .then(result => {
      console.log(result);
      if (!result) {
        throw new Error('This photo doesnt exist.');
      }
      return result.attributes;
    })
    .then(photo => {
      console.log('end', photo);
      res.render('./gallery/edit', photo);
    })
    .catch(err => {
      console.log(err);
      res.app.locals.error = err.message;
      res.status(400).redirect('/');
    });
});

router
  .route('/:id')
  .get((req, res) => {
    return Photo.where('id', req.params.id)
      .fetch()
      .then(result => {
        if (result.length === 0) {
          throw new Error('There are currently no photos.');
        }
        return result.attributes;
      })
      .then(photo => {
        console.log('*****', photo);

        return res.render('./gallery/photo', photo);
      })
      .catch(err => {
        console.log('errors', err);
        return res.render('./gallery/photo', { errors: err.message });
      });
  })
  .put((req, res) => {
    let { author_username, link, description, title } = req.body;
    console.log(req.body);
    return new Photo({ id: req.params.id })
      .save(
        {
          author_username,
          title,
          link,
          description
        },
        { patch: true }
      )
      .then(result => {
        console.log(result);
        res.redirect(`./`);
      })
      .catch(err => {
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    return new Photo({ id: req.params.id })
      .destroy()
      .then(result => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  });

module.exports = router;
