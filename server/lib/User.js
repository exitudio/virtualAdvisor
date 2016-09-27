//Database connection information - mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

 //Step1: we create schema
var mySchema = mongoose.Schema({
    emailAddress: String,
    password: String
});

//Step2: create a model
var User = mongoose.model('loginData',mySchema);

module.exports = User;