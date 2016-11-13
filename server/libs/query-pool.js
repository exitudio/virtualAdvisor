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

/*
 callBack(err,message) must have 2 variables.
 */
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
                            Title:"$courseDetail.Title",
                            Description:"$courseDetail.Description",
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
                        Title:"$program.Requirements.Core.Title",
                        Description:"$program.Requirements.Core.Description",
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
                        courseID: "$courseDetail.Code",
                        Title:"$courseDetail.Title",
                        Description:"$courseDetail.Description",
                        credits:"$courseDetail.Credits",
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
        /*[ { _id: 5813c493df62fb29be4b0d2f,
                Grades:
                    [ { courseID: 'SSW 564',
                        Title: 'Software Requirements Analysis and Engineering ',
                        Description: 'Requirements  Acquisition  is  one  of  the  least  understood  and  hardest  phases  in  the  development  of  software  products, especially  because  requirements  are  often  unclear  in  the  minds  of  many  or  most  stakeholders.  This  course  deals  with the identification of stakeholders, the elicitation and verification of requirements from them, and translation into detailed requirements for a new or to-be-extended software product. It deals further with the analysis and modeling of requirements, the first steps in the direction of software design. The quality assurance aspects of the software requirements phase of the software development process is studied. Also an introduction to several formal methods for requirements specification is presented. Prerequisites: CS 551, SSW 540',
                        credits: ' 3 ',
                        Grade: 'A',
                        score: 4
                    },
                     {
                         courseID: 'SSW 687',
                         Title: 'Engineering of Large Software Systems ',
                         Description: 'Students will learn how to deal with issues impacting industrial software developments. A broad range of topics will be covered, emphasizing large project issues. Large software projects are those employing 50 or more software developers for three years or more. Throughout the course, emphasis will be placed on quantitative evaluation of alternatives. Specific examples and case  histories  from  real  projects  in  the  telephone  industry  are  provided.  Students  will  learn  how  to  create  architectures for large systems based on the ‘4+1’ model; how to use modern software connector technology; module decomposition; scaling of agile methods to large projects, the use of work flows to drive software process and database designs, test plans, and  implementation;  and  configuration  control  and  software  manufacturing.  The  special  issues  of  database  conversion data  consistency,  database  maintenance,  and  performance  tuning  will  be  addressed  for  large  data  bases.  The  physical environment of the computer systems, including multisite deployment, software releases, and special management report generation, are examined. Prerequisites: SSW 540',
                         credits: ' 3 ',
                         Grade: 'A',
                         score: 4 } ],
             id: '10103',
             major: 'Software Engineering',
             Email: 'BaldwinC@stevens.edu',
             requiredCoreCourses:
                 [ {
                     courseID: 'SSW 540',
                     Title: 'Fundamentals of Software Engineering ',
                     Description: 'This  course  introduces  the  subject  of  software  engineering,  also  known  as  software  development  process  or  software development best practice from a quantitative, i.e., analytic- and metrics-based point of view. Topics include introductions to: software life-cycle process models from the heaviest weight, used on very large projects, to the lightest weight, e.g., extreme programming; industry-standard software engineering tools; teamwork; project planning and management; object-oriented analysis and design. The course is case history and project oriented. ',
                     credits: ' 3 '
                 },{
                     courseID: 'SSW 555',
                     Title: 'Agile Methods for Software Development ',
                     Description: 'In software problem areas that require exploratory development efforts, those with complex requirements and high levels of  change,  agile  software  development  practices  are  highly  effective  when  deployed  in  a  collaborative,  people-centered organizational culture. This course examines agile methods, including Extreme Programming (XP), Scrum, Lean, Crystal, Dynamic Systems Development Method and Feature-Driven Development to understand how rapid realization of software occurs most effectively. The ability of agile development teams to rapidly develop high quality, customer-valued software is examined and contrasted with teams following more traditional methodologies that emphasize planning and documentation. Students  will  learn  agile  development  principles  and  techniques  covering  the  entire  software  development  process  from problem conception through development, testing and deployment, and will be able to effectively participate in and manage agile software developments as a result of their successfully completing this course. Case studies and software development projects are used throughout. Cross-listed with: CS 555',
                     credits: ' 3 '
                 },
                 {
                     courseID: 'SSW 564',
                     Title: 'Software Requirements Analysis and Engineering ',
                     Description: 'Requirements  Acquisition  is  one  of  the  least  understood  and  hardest  phases  in  the  development  of  software  products, especially  because  requirements  are  often  unclear  in  the  minds  of  many  or  most  stakeholders.  This  course  deals  with the identification of stakeholders, the elicitation and verification of requirements from them, and translation into detailed requirements for a new or to-be-extended software product. It deals further with the analysis and modeling of requirements, the first steps in the direction of software design. The quality assurance aspects of the software requirements phase of the software development process is studied. Also an introduction to several formal methods for requirements specification is presented. Prerequisites: CS 551, SSW 540',
                     credits: ' 3 '
                 },
                 {
                     courseID: 'SSW 565',
                     Title: 'Software Architecture and Component-Based Design ',
                     Description: 'This  course  introduces  students  to  the  software  design  process  and  it’s  models;  representations  of  design/architecture; software architectures and design plans; design methods; design state assessment; design quality assurance; and design verification. ',
                     credits: ' 3 '
                 }],
             requiredCoreDescription: 'all',
             requiredElective: { 'Required By code': [ 'SSW', 'EM', 'CS' ] },
             totalCredits: 30
        } ]*/

    ],function(err,result) {
        if(callBack) callBack(err,result);
        console.log("+++"+require('util').inspect(result, false, null))
    });
};

/*
 callBack(err,message) must have 2 variables.
 */
Query.getAllProfessors = function(callBack) {
    mongoose.connection.db.collection('professors', function (err, items) {
        items.find({}).toArray(function(err,result) {
            if(callBack) callBack(err,result);
            console.log("+++"+require('util').inspect(result, false, null))
        });
    });
};

//Title:Software Engineering
module.exports = Query;