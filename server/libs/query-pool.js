/**
 * Created by exit on 10/27/16.
 */
var mongoose = require('mongoose');
function Query(){}

/*
 callBack(err,message) must have 2 variables.
 */
Query.getStudentById = function(_id, callBack){
    mongoose.connection.db.collection('Students').aggregate([
        {
            $match:
            {
                id:_id
            }
        },
        {
            $unwind: "$Grades"
        },
        {
            $project:
            {
                "id":"$id",
                "name":1, // do the same thing as "$name"
                "major":"$major",
                "Email":"$Email",
                //"courseCode":"$Grades.courseCode",
                "courseCode":"$Grades.Course Code",
                "grades":"$Grades.Grade"
            }
        },
        {
            $lookup:
            {
                from: "Courses",
                localField: "courseCode",
                foreignField: "Code",
                as: "gradesWithDetail"
            }
        },
        {
            //After $lookup the data return field in array even it's only one data.
            //Using $unwind to get rid of unnecessary array.
            $unwind:"$gradesWithDetail"
        },
        {
            "$group": {
                "_id":{
                    "studentID":"$id",
                    "name":"$name",
                    "major":"$major",
                    "Email":"$Email"
                },
                "grades":{
                    $push:  {
                        grade:"$grades",
                        title:"$gradesWithDetail.Title",
                        code:"$gradesWithDetail.Code",
                        credits:"$gradesWithDetail.Credits",
                        description:"$gradesWithDetail.Description"
                    }
                }
            }
        }
        //,{ $limit: 100 }
    ],function(err,result) {
        if(callBack) callBack(err,result);
        //console.log("+++"+require('util').inspect(result, false, null))
    });
};
module.exports = Query;