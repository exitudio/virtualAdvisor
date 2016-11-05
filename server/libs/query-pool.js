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
                from: "Courses",//join to what table
                foreignField: "Code",//join to what field
                localField: "courseCode",//current field
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


Query.getStudentProgressById = function(_id, callBack){
    mongoose.connection.db.collection('Students').aggregate([
        {
            $match:
            {
                id:_id
            }
        },
        {
            $lookup:
            {
                from: "Programs",
                foreignField: "Title",
                localField: "major",
                as: "program"
            }
        },
        {
            //get rit of unnecessary array (array that's always only 1 length)
            $unwind:"$program"
        },
        {
            //get rit of unnecessary array (array that's always only 1 length)
            $unwind:"$program.Requirements.Core"
        },
        {
            $unwind:"$program.Requirements.Core.Courses"
        },
        {
            $lookup:
            {
                from: "Courses",
                foreignField: "Code",
                localField: "program.Requirements.Core.Courses",
                as: "courseDetail"
            }
        },
        {
            //get rit of unnecessary array (array that's always only 1 length)
            // if there is array inside, it cannot group.
            $unwind:"$courseDetail"
        },
        {
            "$project": {
                "_id":"$_id",
                "id":"$id",
                "major":"$major",
                "Grades":"$Grades",
                "Email":"$Email",
                "program":{
                    "Requirements":{
                        Core: {
                            Courses: "$program.Requirements.Core.Courses",
                            "credits":"$courseDetail.Credits",
                            Required: '$program.Requirements.Core.Required'
                        },
                        Electives: "$program.Requirements.Electives",
                        Credits: "$program.Requirements.Credits"
                    }
                }
            }
        },
        {
            "$group": {
                "_id":{
                    "_id":"$_id",
                    "id":"$id",
                    "major":"$major",
                    "Grades":"$Grades",
                    "Email":"$Email",
                    "program":{
                        "Requirements":{
                            Core: {
                                Required: '$program.Requirements.Core.Required'
                            },
                            Electives: "$program.Requirements.Electives",
                            Credits: "$program.Requirements.Credits"
                        }
                    }
                },
                "courses":{
                    $push: {
                        courseID: "$program.Requirements.Core.Courses",
                        "credits":"$program.Requirements.Core.credits"
                    }
                }
            }
        },
        {
            "$project": {
                "_id":"$_id._id",
                "id":"$_id.id",
                "major":"$_id.major",
                "Grades":"$_id.Grades",
                "Email":"$_id.Email",
                "requiredCoreCourses":"$courses",
                "requiredCoreDescription":"$_id.program.Requirements.Core.Required",
                "requiredElective":"$_id.program.Requirements.Electives",
                "totalCredits":"$_id.program.Requirements.Credits"
            }
        },
        //find credit of Grades
        {
            $unwind:"$Grades"
        },
        {
            $lookup:
            {
                from: "Courses",
                foreignField: "Code",
                localField: "Grades.Course Code",
                as: "courseDetail"
            }
        },
        {
            $unwind:"$courseDetail"
        },
        {
            "$group": {
                "_id":{
                    "_id":"$_id",
                    "id":"$id",
                    "major":"$major",
                    "Email":"$Email",
                    "requiredCoreCourses":"$requiredCoreCourses",
                    "requiredCoreDescription":"$requiredCoreDescription",
                    "requiredElective":"$requiredElective",
                    "totalCredits":"$totalCredits",


                },
                "Grades":{
                    $push: {
                        gradedCode: "$courseDetail.Code",
                        gradedCredits:"$courseDetail.Credits",
                        Grade:"$Grades.Grade"
                    }
                }
            }
        },
        {
            "$project": {
                "_id":"$_id._id",
                "id":"$_id.id",
                "major":"$_id.major",
                "Email":"$_id.Email",
                "requiredCoreCourses":"$_id.requiredCoreCourses",
                "requiredCoreDescription":"$_id.requiredCoreDescription",
                "requiredElective":"$_id.requiredElective",
                "totalCredits":"$_id.totalCredits",
                "Grades":"$Grades"
            }
        }

        //final document :
        /*{ _id: 5813c494df62fb29be4b0d30,
            Grades: [
                { gradedCode: 'SSW 567', gradedCredits: ' 3 ', Grade: 4 },
                { gradedCode: 'CS 385', gradedCredits: ' 4 ', Grade: 4 },
                { gradedCode: 'SSW 687', gradedCredits: ' 3 ', Grade: 4 } ],
             id: '10115',
             major: 'Software Engineering',
             Email: 'WyattX@stevens.edu',
             requiredCoreCourses: [
                 { courseID: 'SSW 540', credits: ' 3 ' },
                 { courseID: 'SSW 555', credits: ' 3 ' },
                 { courseID: 'SSW 564', credits: ' 3 ' },
                 { courseID: 'SSW 565', credits: ' 3 ' },
                 { courseID: 'SSW 567', credits: ' 3 ' },
                 { courseID: 'SSW 533', credits: ' 3 ' }
             ],
             requiredCoreDescription: 'all',
             requiredElective: { 'Required By code': [ 'SSW', 'EM', 'CS' ] },
             totalCredits: 30
        }*/

    ],function(err,result) {
        if(callBack) callBack(err,result);
        console.log("+++"+require('util').inspect(result, false, null))
    });
};

//Title:Software Engineering
module.exports = Query;