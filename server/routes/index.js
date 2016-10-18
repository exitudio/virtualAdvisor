var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
/* GET home page. */
router.get('/student', function(req, res, next) {
  res.sendfile('StudentPage.html');
});
router.get('/index', function(req, res, next) {
    var userName = "";
    if( req.user && req.user.Email){
        userName = req.user.Email.substr(0, 10);
    }
    res.render('index', { userName: userName});
});
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
    //res.render('login',{ message: "" });
});

// process the login form
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
//router.post('/login', passport.authenticate('local-login', {
//  successRedirect : '/profile', // redirect to the secure profile section
//  failureRedirect : '/login', // redirect back to the signup page if there is an error
//  failureFlash : true // allow flash messages
//}));
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/index', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

//logout
router.get('/logout', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


function isAuthenticated(req, res, next) {
    // do any checks you want to in here
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user && req.user.Password)
        return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}


module.exports = router;
