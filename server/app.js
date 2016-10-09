global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}
var express = require('express');
//var session = require('express-session');//express-session
var engine = require('ejs-locals'); //ejs
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* Declare route to js */
var routes = require('./routes/index');
var users = require('./routes/users');

/* mongodb init */
//require("./libs/mongo-pool.js").initPool();
require("./libs/mongoose-init");


//passport-local (for login module )
var passport = require('passport');
var flash    = require('connect-flash');
require('./config/passport');

//express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('ejs', engine); //ejs
app.set('view engine', 'ejs'); //ejs


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/******************************************
 **************** set port ********************
 ******************************************/


//View the Front End Html Pages
app.get('/Student', function (req, res) {
    res.sendfile('StudentPage.html');
});



/******************************************
 **************** passport ********************
 ******************************************/
//app.use(session({ secret: 'welovejamesrowland' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session


/******************************************
**************** ROUTE ********************
******************************************/
app.use('/', routes);
app.use('/users', users);
//app.use('/login', require('./routes/login'));
//api
app.use('/api/departments', require('./routes/api/departments'));






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
