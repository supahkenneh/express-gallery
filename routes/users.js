const express = require('express');
const router = express.Router();
const User = require('../db/models/User');

router
  .route('/')
  .post((req, res) => {
    console.log(req.body);
    let { username, name, email, password } = req.body;
    name = name.trim();
    email = email.trim().toLowerCase();
    username = username.trim();

    return new User({
      username,
      name,
      email,
      password
    })
      .save()
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        res.send(err);
      });
  })
  .get((req, res) => {
    return User.fetchAll()
      .then(users => {
        return res.json(users);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/:id').get((req, res) => {
  return new User()
    .where({ id: req.params.id })
    .fetch()
    .then(user => {
      if (!user) {
        const noUserErr = new Error('User not found');
        noUserErr.statCode = 404;
        throw noUserErr;
      }
      return res.json(user);
    })
    .catch(err => res.json({ message: err.message }));
});

module.exports = router;
