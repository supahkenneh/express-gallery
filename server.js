'use strict';

const express = require('express');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 15000;

const app = express();
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.get('/', (req, res) => {
  res.send('smoketest');
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port: ${PORT}`);
});
