const router = require('express').Router();

const User = require('../db/models/User');

router.get('/', (req, res) => {
  res.send('you got users');
})

module.exports = router;