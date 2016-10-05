var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
  //res.render('login',{ message: "" });
});

// process the login form
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));


module.exports = router;
