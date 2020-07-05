const User = require('../models/users');

// when user sign-up the form
module.exports.create = async function(req,res){
    try {
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
        let user = await User.findOne({email : req.body.email});

        if(user){
            return res.redirect('/sign-in');
        } else {
            await User.create(req.body);
            req.flash("success",'user successfully sign-up');
            return res.redirect('/sign-in');
        }
    } catch (error) {
        console.log("error in user create",error);
        return res.redirect('back');
    }
}

// when user try to sign-in 
module.exports.createSession = function(req,res){
    req.flash("success",'user successfully logged in');
    return res.redirect('/home');
}

// this will open user profile page
module.exports.profile = function(req,res){
    return res.render('profile',{
        title : "profile Page"
    })
}