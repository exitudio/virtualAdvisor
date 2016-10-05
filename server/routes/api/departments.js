var express = require('express');
var router = express.Router();
var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');

var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

/* Department. */
router.get('/', function(req, res, next) {
    MongoPool.getInstance(function (db){

        var collection = db.collection('departments');
        collection.find().toArray(function(err, items) {
            db.collection('departments').find().toArray(function(err, items) {
                res.send(items);
            });
        });
    });
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
        db.collection('courses').find(findObject).toArray(function(err, items) {
            res.send(items);
        });
    });
}).post(function(req, res) {});


module.exports = router;
