var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Program and Courses. */

router.post('/courses', function(req, res, next)
          {
    var majorType= req.body.Type
    var departments = req.body.Department
    var level = req.body.Level
    mongoose.connection.db.collection('Programs', function(err, items){
        items.find({"Type":majorType,"Department":departments,"Level":level}).toArray(function(err, results){
            res.send(results);
        })
    })
}).post(function(req, res) {});

module.exports = router;