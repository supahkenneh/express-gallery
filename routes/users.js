const router = require('express').Router();

const User = require('../db/models/User');
const helpers = require('../helpers/helpers');

router.use(helpers.isAuthenticated);

router.get('/', (req, res) => {
})

module.exports = router;