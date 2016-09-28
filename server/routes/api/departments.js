var express = require('express');
var router = express.Router();
var MongoPool = rootRequire("libs/mongo-pool.js");

/* Department. */
router.get('/', function(req, res, next) {    
    MongoPool.getInstance(function (db){
        var collection = db.collection('department');
        collection.find().toArray(function(err, items) {
            res.send(items);
        });          
    });    
}).post(function(req, res) {});

/* Courses. */
router.get('/courses/:departmentId', function(req, res, next) {    
    MongoPool.getInstance(function (db){
        var collection = db.collection('courses');
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });    
}).post(function(req, res) {});

router.get('/test', function(req, res, next) {    
    MongoPool.getInstance(function (db){
        var collection = db.collection('StudentsInfo');
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });   
}).post(function(req, res) {});

module.exports = router;
