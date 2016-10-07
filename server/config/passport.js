var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-login',new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(username, password, done) {
        /*User.findOne({ emailAddress: username }, function(err, user) {
            if(err){
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Email ' + username + ' not found'});
            }
            else{
                //check if password matches and pass parameters in done accordingly
            }
        });*/
        //console.log(done);
        console.log("in");
        //return done(null, false, req.flash('loginMessage', 'No user found.'));
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        return done(null);
    }
));