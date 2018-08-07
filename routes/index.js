const express = require('express');
// const users = require('./users');
const gallery = require('./gallery');
const router = express.Router();

// router.use('/users', users);
router.use('/gallery', gallery);

module.exports = router;