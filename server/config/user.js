// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = new mongoose.Schema(
    {
        Email        : String,
        Password     : String,
        major        : String,
    },
    { collection : 'Students' }
);


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    console.log("p:"+this.Password);
    console.log("new pass:"+bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) );
    return bcrypt.compareSync(password, this.Password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
