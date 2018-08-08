'use strict';

const express = require('express');

const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const hiddenMethodParser = require('./helper/hiddenMethodParser');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 15000;

const app = express();
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  methodOverride((req, res) => {
    return hiddenMethodParser(req, res);
  })
);

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
);

app.set('view engine', '.hbs');

app.use('/', routes);

app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port: ${PORT}`);
});
