const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');

const passport = require('./passport');
const models = require('../models');

const app = express();
app.locals.models = models;

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Setup sessions
app.use(cookieParser());
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var sessionStore = new SequelizeStore({
    db: models.sequelize
});
sessionStore.sync();
app.use(session({
    secret: 'Shhhhh!',
    store: sessionStore,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes'));

module.exports = app;
