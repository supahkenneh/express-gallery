const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.port || 3005;
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', routes);

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.listen(PORT, () => {
  console.log(`Server Initiated on PORT: ${PORT}`)
});