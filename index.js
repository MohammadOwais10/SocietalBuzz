const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');

app.use(
  sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css',
  })
);

app.use(express.urlencoded());

//use cookie parser
app.use(cookieParser());

//static files access
app.use(express.static('./assets'));

// use express ejs layouts
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// use express router
// app.use('/', require('./routes'));

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
// For encrypting the cookie
app.use(
  session({
    // Name of cookie
    name: 'societal',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    // if user is not logged in then don't save the cookie
    saveUninitialized: false,
    // don't save data again and again in the database
    resave: false,
    //Give time session for cookie and after that cookie expires
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: 'mongodb://localhost/societal_development',
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err || 'connect-mongodb setup ok');
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server:${err}`);
  }
  console.log(`Server is running on port :${port}`);
});
