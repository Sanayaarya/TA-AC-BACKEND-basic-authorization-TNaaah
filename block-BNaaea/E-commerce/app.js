var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');

require('dotenv').config();
// var slug = require('slug');
const session = require('express-session');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var clientRouter = require('./routes/client');
var dashboardRouter = require('./routes/dashboard');
var usersRouter = require('./routes/users');
var auth = require('./middleware/auth');
//connect mongoose
mongoose.connect(
  'mongodb://localhost:27017/Assigment-2',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(err ? err : 'connect with Databasa');
  }
);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect with session
// creating session
app.use(
  session({
    secret: 'somerandomsecret',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/Assigment-2',
    }),
  })
);

app.use(flash());

app.use('/home', indexRouter);
app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;