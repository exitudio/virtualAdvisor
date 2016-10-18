var express = require('express');
var router = express.Router();
//var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');
var mongoose = require('mongoose');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Department. */
router.get('/majors', function(req, res, next) {
    var action = function (err, collection) {
        collection.find().toArray(function(err, results) {
            res.send(results);
        });
    };
    mongoose.connection.db.collection('Majors', action);
}).post(function(req, res) {});



/* Courses. */
router.get('/:departmentIdOrName/courses', function(req, res, next) {
    var departmentIdOrName = req.params.departmentIdOrName;

    var findObject;
    if( checkForHex.test(departmentIdOrName) ){
        findObject = {"major.id":new mongo.ObjectID(departmentIdOrName)};
    }else{
        findObject = {"major.name":departmentIdOrName};
    }

    mongoose.connection.db.collection('Courses', function (err, collection) {
        collection.find(findObject).toArray(function(err, results) {
            res.send(results);
        });
    });
}).post(function(req, res) {});

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
        items.find({"Department":departments},{"_id":0,"Title":1,"Type":1}).toArray(function(err, results){
            res.json(results);
            res.end();
        });
    });

}).post(function(req, res) {});

module.exports = router;

