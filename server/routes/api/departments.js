var express = require('express');
var router = express.Router();
var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');
var mongoose = require('mongoose');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Department. */
router.get('/', function(req, res, next) {
    var action = function (err, collection) {
        collection.find().toArray(function(err, results) {
            res.send(results);
        });
    };
    mongoose.connection.db.collection('courses', action);
}).post(function(req, res) {});

/* Courses. */
router.get('/courses/:departmentIdOrName', function(req, res, next) {
    MongoPool.getInstance(function (db){
        var departmentIdOrName = req.params.departmentIdOrName;

        var findObject;
        if( checkForHex.test(departmentIdOrName) ){
            findObject = {"department.id":new mongo.ObjectID(departmentIdOrName)};
        }else{
            findObject = {"department.name":departmentIdOrName};
        }

        mongoose.connection.db.collection('courses', function (err, collection) {
            collection.find(findObject).toArray(function(err, results) {
                res.send(results);
            });
        });
    });
}).post(function(req, res) {});


module.exports = router;
