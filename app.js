const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');

const v1 = require('./routes/v1');
const app = express();

const CONFIG = require('./config/config');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Passport
app.use(passport.initialize());

// Log Env
console.log('Environment:', CONFIG.app);

// Database
const models = require('./models');
models.sequelize.authenticate().then(() => {
  console.log('Connected to SQL database:', CONFIG.db_name);
})
    .catch((err) => {
      console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
    });

if (CONFIG.app==='dev') {
  models.sequelize.sync();
}

// CORS
app.use(cors());

app.use('/v1', v1);

app.use('/', function(req, res) {
  res.statusCode = 200;// send the appropriate status code
  res.json({status: 'success', message: 'Parcel Pending API', data: {}});
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Uncaught Error', pe(error));
});
