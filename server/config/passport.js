var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = rootRequire('/config/user');
var mongoose = require('mongoose');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        //if (email)
        //    email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        //process.nextTick(function() {

            User.findOne({ 'Email' :  email }, function(err, user) {
                //console.log(' Callback from db : email='+email);
                //console.log(user);
                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                }else{
                    return done(null, user);
                }
            });
       // });

    }));