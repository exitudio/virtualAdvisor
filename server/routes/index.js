var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var query = rootRequire("libs/query-pool");


/* GET home page. */
router.get('/test'/*,isAuthenticated*/, function(req, res, next) {
    rootRequire("libs/query-pool").getStudentById("10103",function(err,result){
        //console.log( result[0].grades );
    });
    //res.render('index', {title: 'Express'});
});

// student
router.get('/student',isAuthenticated, function(req, res, next) {
    console.log("____");
    console.log(req.session);
    var userName = "";
    if( req.user && req.user.Email){
        userName = req.user.Email.substr(0, 10);
    }
    res.render("studentPage.ejs", { userName: userName});
  //res.sendfile('StudentPage.html');
});

// index
router.get('/index', function(req, res, next) {
    var userName = "";
    if( req.user && req.user.Email){
        userName = req.user.Email.substr(0, 10);
    }
    console.log("userName : "+userName);
    res.render('index', { userName: userName});
});
router.get('/', function(req, res, next) {
    var userName = "";
    if( req.user && req.user.Email){
        userName = req.user.Email.substr(0, 10);
    }
    res.render('index', { userName: userName});
});

//login
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });

  //res.render('login',{ message: "" });
});
router.get('/signup', function(req, res, next) {
    res.render('signup.ejs', {  });
});
router.get('/signup_temp', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup_temp.ejs', { message: req.flash('signupMessage') });
});
// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/student', // redirect to the secure profile section
    failureRedirect : '/signup_temp', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// process the login form
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
/*router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/student', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));*/

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/student');
        });
    })(req, res, next);
});



function isAuthenticated(req, res, next) {
    console.log("isAuthenticated:"+req.user);
    if (req.user && req.user.Password)
        return next();
    res.redirect('/login');
}



router.get('/candidacy',isAuthenticated, function(req, res, next) {

    namesofUser = req.user._doc.name.split(" ");
    studentData = new Object();
    studentData.firstName = namesofUser[0];
    studentData.lastName = namesofUser[1];
    studentData.major = req.user._doc.major;
    studentData.id = req.user._doc.id;
    rootRequire("libs/query-pool").getStudentById(studentData.id,function(err,result){
        if( result ){
            studentData.grades = result[0].grades;
            res.render("candidacy.ejs", studentData);
        }
    });
    //res.sendfile('StudentPage.html');
});

module.exports = router;
