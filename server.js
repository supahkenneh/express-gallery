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

const { methodSwitch } = require('./helpers/helpers');
const auth = require('./routes/auth');
const user = require('./routes/users');
const gallery = require('./routes/gallery');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

console.log('after public');

app.use(session({
  store: new Redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(methodOverride((req, res) => {
  return methodSwitch(req, res );
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth);
app.use('/users', user);
app.use('/gallery', gallery);

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.get('*', (req, res) => {
console.log('in catch all');
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server Initiated on PORT: ${PORT}`)
});
