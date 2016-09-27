var express = require('express');
var router = express.Router();
var User = require('../lib/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Creating new RestfulAPI code
router.get('/healthcheck', function(req, res) {
           var responseString = 'OK';
           res.send(responseString);
           
});

//login Validation Check
//Database connection information - mongodb
router.get('/login', function (req, res){
    var emailAddress = "dparikh";
    var password = "password123";
    User.findOne ({emailAddress: emailAddress, password: password }, function(err, user) {
        if (err)
            {
                console.log(err);
                return res.status(500).send();
            }
        if (!user) {
            console.log(user + password + emailAddress);
            return res.status(404).send();
        }
            return res.status(200).send();
    })
    
});

module.exports = router;
