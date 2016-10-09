var express = require('express');
var router = express.Router();
//var MongoPool = rootRequire("libs/mongo-pool.js");
var mongoose = require('mongoose');
var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Department. */
/*
router.get('/', function(req, res, next) {    
    MongoPool.getInstance(function (db){
        var collection = db.collection('departments');
        collection.find().toArray(function(err, items) {
        db.collection('departments').find().toArray(function(err, items) {
            res.send(items);
        });
});		
    });    
=======*/
router.get('/', function(req, res, next) {
    /*MongoPool.getInstance(function (db){

        var collection = db.collection('departments');
        collection.find().toArray(function(err, items) {
            db.collection('departments').find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };*/
    mongoose.connection.db.collection('courses', action);

}).post(function(req, res) {});

/* Courses. */
router.get('/courses/:departmentIdOrName', function(req, res, next) {
    var departmentIdOrName = req.params.departmentIdOrName;

    var findObject;
    if( checkForHex.test(departmentIdOrName) ){
        findObject = {"department.id":mongoose.Types.ObjectId(departmentIdOrName)};
    }else{
        findObject = {"department.name":departmentIdOrName};
    }

    mongoose.connection.db.collection('courses', function (err, collection) {
        collection.find(findObject).toArray(function(err, results) {
            res.send(results);
        });
    });
    /*MongoPool.getInstance(function (db){
        var departmentIdOrName = req.params.departmentIdOrName;

        var findObject;
        if( checkForHex.test(departmentIdOrName) ){
            findObject = {"department.id":new mongo.ObjectID(departmentIdOrName)};
        }else{
            findObject = {"department.name":departmentIdOrName};
        }
        db.collection('courses').find(findObject).toArray(function(err, items) {
            res.send(items);
        });
    });*/
}).post(function(req, res) {});


module.exports = router;
