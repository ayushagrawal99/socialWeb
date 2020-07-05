const resetPassword = require('../models/reset_password');
const User = require('../models/users');
const resetPasswordMailer = require('../mailer/reset-password');
const crypto = require('crypto');
const { compile } = require('ejs');

// this will open forget password page 
module.exports.forgetPassword = function(req,res){
    return res.render('forget_password',{
        title : "Forget Password"
    });
}

// this fun will check that email is valid or not if mail will valid then we send a mail
module.exports.sendMail = async function(req,res){
    try {
        let user = await User.findOne({email : req.body.email});

        // if user exits then create accesstoken
        if(user){
            let accessToken = crypto.randomBytes(20).toString('hex');

            let token = await resetPassword.create({
                user : user._id,
                accesstoken : accessToken,
                isValid : true
            });
            // now we send a mail
            resetPasswordMailer.resetPasswordMail(user.email,accessToken);

            // after 90 sec the link will expire on gmail
            let invalid = setTimeout(makeTokenInvalid,6000);

            function makeTokenInvalid(){
                token.isValid = false;
                token.save();
            }

            req.flash('success',"Mail has been send on your gmail");
            return res.redirect('back');
        } else {
            req.flash('error',"Invalid user");
            return res.redirect('back');
        }
    } catch (error) {
        console.log("error in forget password",error);
        return;
    }
}

//ye mail link check krega or reset password ka form render krega
module.exports.checkMailLink = async function(req,res){
    try{

        let validtoken = await resetPassword.findOne({accesstoken : req.query.accesstoken});

        if(validtoken && validtoken.isValid){
            let user = await User.findById(validtoken.user);
            
            return res.render('change_password',{
                title : "change Password",
                accesstoken : req.query.accesstoken,
                userId : user._id
            });
        } else {
            return res.send("<p> This page is anuthorized! you token has expired!! </p>");
        }
    }catch (error) {
        console.log("access token page is not found",error);
        return;
    }
}

// this will change the user password
module.exports.setNewPassword = async function(req,res){
    try {
        if(req.body.password != req.body.confirm_password){
            req.flash("error","Password does not match");
            return res.redirect('back');
        }
        let validtoken = await resetPassword.findOne({accesstoken : req.body.accesstoken});
       
        if(validtoken.isValid){
            let user = await User.findByIdAndUpdate(req.body.userId, {password : req.body.password});

            validtoken.isValid = false;
            user.save();
            
            req.flash("success","password changed successfully");
            return res.redirect('/sign-in');
        } else {
            req.flash("error","page not found");
            console.log("error in findout accesstoken");
            return res.redirect('back');
        }

    } catch (error) {
        console.log("error in change password",error);
        return;
    }
}