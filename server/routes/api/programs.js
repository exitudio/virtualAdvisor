var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Program and Courses. */

router.post('/courses', function(req, res, next)
          {
    var majorType= req.body.Type;
    var departments = req.body.Department;
    var level = req.body.Level;
    var title = req.body.Title;
    mongoose.connection.db.collection('Programs', function(err, items){
        items.find({"Type":majorType,"Department":departments,"Level":level,"Title":title}).toArray(function(err, results){
            res.send(results);
        })
    })
});

router.post('/courseAdvisor', function (req, res, next)
            {
    var level = req.body.Level;
    var title = req.body.Title;
    mongoose.connection.db.collection('Programs', function(err, items){
        items.find({"Level":level,"Title":title}).toArray(function(err, results){
            res.send(results);
        })
    })
    
});

router.post('/courseTest', function (req, res, next)
            {
    var name = req.body.name;
    mongoose.connection.db.collection('People', function(err, items){
        items.find({"name":name}).toArray(function(err, results){
            if (results !== null)
                {
                    console.log("Concentration Test");
                    var level = req.body.Level;
                    var title = req.body.Title;
                    mongoose.connection.db.collection('Programs', function(err, items){
                        items.find({"Level":"Undergraduate","Title":"Computer Engineering"}).toArray(function(err, results){
                            res.send(results[0].Concentrations);
                        })
    })
                }
            else{
                console.log("Username does not exist in database");
            }
        })
    })
    
});

module.exports = router;