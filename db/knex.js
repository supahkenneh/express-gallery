'use strict';

const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const config = require('../knexfile')[ENVIRONMENT];j
module.exports= require('knex')(config);