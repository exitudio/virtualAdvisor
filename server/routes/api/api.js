var express = require('express');
var router = express.Router();
//var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');
var mongoose = require('mongoose');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

router.get('/departments',function(req,res,next) {
    var action = function (err, collection) {
        collection.distinct('Department',function(err, results) {
            if(err)
                console.log(err);
            else {
                res.send(results);
            }
        });
    };
    mongoose.connection.db.collection('Programs', action);

});

router.post('/programs',function(req,res) {


    var departments = req.body.department
    mongoose.connection.db.collection('Programs', function(err, items){
        items.find({"Department":departments},{"_id":1,"Title":1,"Type":1}).toArray(function(err, results){
            res.json(results);
            res.end();
        });
    });

}).post(function(req, res) {});

router.post('/req',function(req,res) {


    var programId = new mongo.ObjectID(req.body.id);
    mongoose.connection.db.collection('Programs', function(err, items){
        items.findOne({"_id":programId},{"_id":0,"Requirements":1,"CoursesList":1},function(err, results){
            res.json(results);
            res.end();
        });
    });

}).post(function(req, res) {});


router.post('/submit_candidacy', function(req, res, next) {
    console.log(req);
    res.send('You sent the name "' + req.body + '".');
});


module.exports = router;
