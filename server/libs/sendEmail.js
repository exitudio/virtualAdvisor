/**
 * Created by exit on 11/12/16.
 */
function SendEmail(){}
/*
 callBack(err,message) must have 2 variables.
 */
SendEmail.send = function(data,onComplete,onError) {
    //professorEmail=exitudio%40gmail.com&topic=t&description=d&day=17+November+2016&student_time=15%3A30

    var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL,
                      // you can try with TLS, but port is then 587
        auth: {
            //user: 'weloverowland@gmail.com', // Your email id
            user: 'virtualAdvisorMail@gmail.com', // Your email id
            pass: 'weLoveRowland' // Your password
        }
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    //var transporter = nodemailer.createTransport('smtps://exitudio@gmail.com:PASSWORD_CHANGE_ME@smtp.gmail.com');

// setup e-mail data with unicode symbols
    /*var mailOptions = {
        from: '"Virtual Advisor" <virtualAdvisorMail@gmail.com>', // sender address
        to: data.body.professorEmail, // list of receivers
        subject: data.body.topic, // Subject line
        text: data.body.description+"  [Student time requrest : "+data.body.day+" at "+data.body.student_time+"]", // plaintext body
        //html: '<b>Hello world ?</b>' // html body
    };*/

// send mail with defined transport object
    transporter.sendMail(data, function(error, info){
        if(error){
            onError(error);
            return console.log(error);
        }
        onComplete(info.response);
        console.log('Message sent: ' + info.response);
    });
};

//Title:Software Engineering
module.exports = SendEmail;