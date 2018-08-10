const express = require('express');
const session = require('express-session');
const Redis = require('connect-redis')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const PORT = process.env.port || 3005;
// const routes = require('./routes');
const auth = require('./routes/auth');
const user = require('./routes/users');
const gallery = require('./routes/gallery');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

app.use(session({
  store: new Redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth);
app.use('/users', user);
app.use('/gallery', gallery);
// app.use('/', routes);

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.listen(PORT, () => {
  console.log(`Server Initiated on PORT: ${PORT}`)
});