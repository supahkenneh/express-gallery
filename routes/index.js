const express = require('express');
// const users = require('./users');
const photos = require('./photos');
const router = express.Router();

// router.use('/users', users);
router.use('/gallery', photos);

module.exports = router;