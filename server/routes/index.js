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
    var studentID = req.user._doc.id;//"10115";//
    rootRequire("libs/query-pool").getStudentProgressById(studentID,function(err,result){

        //progress
        var totalCoreGradedCredits = 0;
        var totalElectiveGradedCredits = 0;
        var totalCoreCredits = 0;
        var totalElectiveCredits = 0;
        //courses data
        var completeCoreCourses = [];
        var notCompleteCoreCourses = [];
        var completeElectiveCourses = [];
        //gpa
        var gpa;
        //GPA
        if( result && result[0] && result[0].Grades ){



            var student = result[0];
            if(student.Grades)
                gpa = GPA(student.Grades);

            if( student && student.Grades &&student.requiredCoreCourses){
                //console.log("1");
                for( var i=0; i<=student.Grades.length-1; i++){

                    //check core
                    //console.log("2");
                    var isCore = false;
                    for( var j=0; j<=student.requiredCoreCourses.length-1; j++){
                        //console.log("3");
                        if( student.requiredCoreCourses[j].courseID === student.Grades[i]["courseID"] ){
                            //console.log(student.requiredCoreCourses[j].courseID+" is core");
                            totalCoreGradedCredits += parseInt(student.requiredCoreCourses[j].credits);
                            completeCoreCourses.push(student.Grades[i]);
                            isCore = true;
                            break;
                        }
                    }
                    //check elective.
                    if(!isCore){
                        //check elective
                        //console.log(student.Grades[i]["courseID"]+" is not core");
                        var splitCode = student.Grades[i]["courseID"].split(" ");
                        for( var j=0; j<=student.requiredElective["Required By code"].length-1; j++){
                            //console.log(" check :: "+splitCode[0]+" , "+ student.requiredElective["Required By code"][j]);
                            if( splitCode[0] == student.requiredElective["Required By code"][j] ){
                                totalElectiveGradedCredits += parseInt(student.Grades[i]["credits"]);
                                completeElectiveCourses.push(student.Grades[i]);
                                break;
                            }
                        }
                    }
                }
                //find not complete core courses
                for( var i=0; i<=student.requiredCoreCourses.length-1; i++){
                    var isCompleted = false;
                    for( var j=0; j<=completeCoreCourses.length-1; j++){
                        if( student.requiredCoreCourses[i].courseID == completeCoreCourses[j].courseID ){
                            isCompleted=true;
                            break;
                        }
                    }
                    if(!isCompleted){
                        notCompleteCoreCourses.push(student.requiredCoreCourses[i]);
                    }
                }
                //total core credits

                for( var i=0; i<=student.requiredCoreCourses.length-1; i++){
                    totalCoreCredits += parseInt(student.requiredCoreCourses[i].credits);
                }

                //total core elective
                totalElectiveCredits = student.totalCredits-totalCoreCredits;

                console.log("totalCoreGradedCredits:"+totalCoreGradedCredits);
                console.log("totalElectiveGradedCredits:"+totalElectiveGradedCredits);
                console.log("totalCoreCredits:"+totalCoreCredits);
                console.log("totalElectiveCredits:"+totalElectiveCredits);
                console.log("notCompleteCoreCourses"+require('util').inspect(notCompleteCoreCourses, false, null))
            }
        }

        // render view
        var userName = "";
        if( req.user && req.user._doc && req.user._doc.name){
            userName = req.user._doc.name;
        }
        res.render("student.ejs", {
            userName: userName,
            //core
            totalCoreGradedCredits: totalCoreGradedCredits,
            totalCoreCredits:totalCoreCredits,
            coreCreditsLeft: (totalCoreCredits-totalCoreGradedCredits),
            //elective
            totalElectiveGradedCredits: totalElectiveGradedCredits,
            totalElectiveCredits:totalElectiveCredits,
            electiveCreditsLeft: (totalElectiveCredits-totalElectiveGradedCredits),
            //courses object
            completeCoreCourses:completeCoreCourses,
            notCompleteCoreCourses:notCompleteCoreCourses,
            completeElectiveCourses:completeElectiveCourses,
            //gpa
            gpa:gpa
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


//courseAdvisor
router.get('/courseAdvisor',isAuthenticated, function(req, res, next) {
    var userName = "";
    if( req.user && req.user._doc && req.user._doc.name){
        userName = req.user._doc.name;
    }
    res.render("courseAdvisor.ejs",{userName:userName});
});

router.get('/StudentProfile',isAuthenticated, function(req, res, next) {
    var userName = "";
    if( req.user && req.user._doc && req.user._doc.name){
        userName = req.user._doc.name;
    }
    res.render("StudentProfile.ejs",{userName:userName});
});

//appointment
//https://mattlewis92.github.io/angular-bootstrap-calendar/#?example=kitchen-sink
router.get('/appointment',isAuthenticated, function(req, res, next) {
    rootRequire("libs/query-pool").getAllProfessors(function(err,result){
        var data = new Object();
        data.professors = result;
        data.errorMessage = req.query.error;
        data.successMessage = req.query.success;
        data.userName = "";
        if( req.user && req.user._doc && req.user._doc.name){
            data.userName = req.user._doc.name;
        }
        res.render("appointment.ejs",data);
    });
});
router.post('/appointment',isAuthenticated, function(req, res, next) {
    //console.dir(req);
    var mailOptions = {
        from: '"Virtual Advisor" <virtualAdvisorMail@gmail.com>', // sender address
        to: req.body.professorEmail, // list of receivers
        subject: req.body.topic, // Subject line
        text: req.body.description+"  [Student time requrest : "+req.body.day+" at "+req.body.student_time+"]", // plaintext body
        //html: '<b>Hello world ?</b>' // html body
    };
    rootRequire("libs/sendEmail").send(mailOptions,function(message){
        res.redirect('/appointment?success=true');
    },function(message){
        res.redirect('/appointment?error='+message);
    });
    //res.send('POST request to the homepage');
});

//Student Profile
router.post('/UserProfile',isAuthenticated, function(req, res, next){
    var userName = "";
    if( req.user && req.user._doc && req.user._doc.name){
        userName = req.user._doc.name;
    }
    mongoose.connection.db.collection('People', function(err, items){
        items.find({"name":userName}).toArray(function(err, results){
            if (results !== null)
                {
                    console.log("Student Profile information Received");
                    res.send(results);
                }
            else{
                console.log("Username does not exist in database");
            }
        })
    })
    
});

//candidacy
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

//Userprofile
router.post('/userprofile', function (req, res, next)
            {
    var email = req.body.Email;
    mongoose.connection.db.collection('People', function(err, items){
        items.find({"Email":email}).toArray(function(err, results){
            res.send(results);
        })
    })
    
});

module.exports = router;
function GPA(grades){
    sum = 0
    for (i=0; i<grades.length; i++){
        switch (grades[i].Grade) {
            case 'A+':
                grades[i]["score"]= 4.0;
                break;
            case 'A':
                grades[i]["score"]= 4.0;
                break;
            case 'A-':
                grades[i]["score"]= 3.7;
                break;
            case 'B+':
                grades[i]["score"]= 3.3;
                break;
            case 'B':
                grades[i]["score"]= 3.0;
                break;
            case 'B-':
                grades[i]["score"]= 2.7;
                break;
            case 'C+':
                grades[i]["score"]= 2.3;
                break;
            case 'C':
                grades[i]["score"]= 2.0;
                break;
            case 'C-':
                grades[i]["score"]= 1.7;
                break;
            case 'D+':
                grades[i]["score"]= 1.3;
                break;
            case 'D':
                grades[i]["score"]= 1.0;
                break;
            case 'F':
                grades[i]["score"]= 0.0;
                break;
            default:
                console.log("Not a grade")
                break;
        }
        sum+=grades[i]["score"]
        average= sum/grades.length
    }
    return average
}


