// Nodemailer is a module for Node.js applications to allow easy as cake email sending. 
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// transporter will define how our server will comunicate with mailer server
let transporter = nodemailer.createTransport(env.smtp);

// we define that we will use ejs for sending HTML mail
let renderTemplate = (data,relativePath) => {
    let mailHTML;
    // we require ejs for render the template and send it 
    ejs.renderFile(
        // where i placed my template in the views, so we define a path for it
        path.join(__dirname,'../views/mailer',relativePath),
        data,              // the content which we pass to ejs template file
        function(err,template){
            if(err){
                console.log("error in render file",err);
                return;
            }
            mailHTML = template;
        }
    )
    // finally we return our html template
    return mailHTML;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}