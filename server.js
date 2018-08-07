const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.port || 3005;
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes)

app.listen(PORT, () => {
  console.log(`Server Initiated on PORT: ${PORT}`)
});