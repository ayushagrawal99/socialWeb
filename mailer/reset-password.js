const nodemailer = require('../config/nodemailer');

// this function will send a mail to the user
module.exports.resetPasswordMail = async function(userEmail,accesstoken){

    let htmlString = nodemailer.renderTemplate({accesstoken : accesstoken},"/forget-password/reset-password.ejs");

    nodemailer.transporter.sendMail({
        from: "ayushelect2020@gmail.com",
        to: userEmail,
        subject: "Reset Password Email",
        html: htmlString
    },
    function(err,info){
        if(err){
            console.log("error in sending the mail",err);
            return;
        }
        console.log("message send");
        return;
    })
}