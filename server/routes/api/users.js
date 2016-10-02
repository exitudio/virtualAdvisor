/**
 * Created by exit on 10/1/16.
 */
var express = require('express');
var router = express.Router();
var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');


/* Department. */
router.get('/', function(req, res, next) {
    MongoPool.getInstance(function (db){
        db.collection('departments').find().toArray(function(err, items) {
            res.send(items);
        });
    });
}).post(function(req, res) {});

module.exports = router;