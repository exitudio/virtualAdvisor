var express = require('express');
var router = express.Router();
//var MongoPool = rootRequire("libs/mongo-pool.js");
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var checkForHex = new RegExp('^[0-9a-fA-F]{24}$');

router.get('/departments',function(req,res) {
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
router.get('/advisors',function(req,res) {
    var action = function (err, collection) {
        collection.distinct('lastName',function(err, results) {
            if(err)
                console.log(err);
            else {
                res.send(results);
            }
        });
    };
    mongoose.connection.db.collection('professors', action);

});

router.post('/course',function(req,res) {


    var code = req.body.course_code;
    mongoose.connection.db.collection('Courses', function(err, items){
        items.find({"Code":code},{"_id":0,"Title":1}).toArray(function(err, results){
            res.send(results);
            res.end();
        });
    });

});

router.post('/programs',function(req,res) {


    var departments = req.body.department
    mongoose.connection.db.collection('Programs', function(err, items){
        items.find({"Department":departments},{"_id":1,"Title":1,"Type":1}).toArray(function(err, results){
            res.json(results);
            res.end();
        });
    });

});

router.post('/req',function(req,res) {


    var programId = new mongo.ObjectID(req.body.id);
    mongoose.connection.db.collection('Programs', function(err, items){
        items.findOne({"_id":programId},{"_id":0,"Requirements":1,"CoursesList":1},function(err, results){
            res.json(results);
            res.end();
        });
    });

});
router.post('/register',function(req,res) {
    req.body.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);


            mongoose.connection.db.collection('Students', function (err, items) {
                items.insertOne(
                    {
                        'name': req.body.name,
                        'Email': req.body.Email,
                        'Password': req.body.password,
                        'major': req.body.major,
                        'Grades': req.body.Grades,
                        'Advisor': req.body.Advisor
                    }, function (err, results) {

                    }
                );

            });


res.redirect(('/'))


    //});
});
router.post('/checkAccount',function(req,res) {


    var email = req.body.Email;
    mongoose.connection.db.collection('Students', function(err, items){
        items.findOne({'Email':email},function(err, results){
            if(results!=null)
            {
                res.send({'Account': 'exist'});
            }
            else
            {
                res.send({'Account':'new'});
            }
        });
    });

});

router.post('/submit_candidacy', function(req, res, next) {
    res.send('You sent the name "' + req.body + '".');
});




module.exports = router;
