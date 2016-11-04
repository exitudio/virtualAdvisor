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

    mongoose.connection.db.collection('Students', function(err, items){
        items.findOne({"id":req.user._doc.id},function(err, results){
            if( results && results.Grades ){
                /*for( var i=0;i<=results.Grades.length-1;i++){
                    console.log(results.Grades[0]["Course Code"]);
                    console.log(results.Grades[0]["Grade"]);
                    
                }*/

                console.log(GPA(results.Grades.));
            }


            // reder view
            var userName = "";
            if( req.user && req.user.Email){
                userName = req.user.Email.substr(0, 10);
            }
            res.render("studentPage.ejs", { userName: userName});
        });
    });


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

// logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

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

    if(req.user._doc.name != undefined )
        namesofUser = req.user._doc.name.split(" ");
    else
        namesofUser = ["",""];
    studentData = new Object();
    studentData.firstName = namesofUser[0];
    studentData.lastName = namesofUser[1];
    studentData.major = req.user._doc.major;
    studentData.id = req.user._doc.id;
    rootRequire("libs/query-pool").getStudentById(studentData.id,function(err,result){
        if( result ){
            if( result && result[0])
                studentData.grades = result[0].grades;
            res.render("candidacy.ejs", studentData);
        }
    });
    //res.sendfile('StudentPage.html');
});

module.exports = router;
function GPA(grades){
    sum = 0
    for (i=0; i<grades.length; i++){
        switch (grades[i]) {
            case 'A+':
                grades[i]= 4.0;
                break;
            case 'A':
                grades[i]= 4.0;
                break;
            case 'A-':
                grades[i]= 3.7;
                break;
            case 'B+':
                grades[i]= 3.3;
                break;
            case 'B':
                grades[i]= 3.0;
                break;
            case 'B-':
                grades[i]= 2.7;
                break;
            case 'C+':
                grades[i]= 2.3;
                break;
            case 'C':
                grades[i]= 2.0;
                break;
            case 'C-':
                grades[i]= 1.7;
                break;
            case 'D+':
                grades[i]= 1.3;
                break;
            case 'D':
                grades[i]= 1.0;
                break;
            case 'F':
                grades[i]= 0.0;
                break;
            default:
                console.log("Not a grade")
                break;
        }
        sum+=grades[i]
        average= sum/grades.length
    }
    return average
}


