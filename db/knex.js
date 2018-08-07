'use strict';

const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const config = require('../knexfile')[ENVIRONMENT];
module.exports= require('knex')(config);