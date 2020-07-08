const User = require("../models/users");
const passport = require('passport');

// it will open sign-up page (localhost:8000/)
module.exports.signUp = function(req,res){
    // if user already logged-in then we send the user to home page
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    return res.render('home_sign_up',{
        title : "User Sign-Up"
    })
}

// it will open sign-in page
module.exports.signIn = function(req,res){
    // if user already logged-in then we send the user to home page
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    return res.render('home_sign_in',{
        title : "User Sign-In"
    })
}

// it will open user Home page when user sign-in done
module.exports.home = async function(req,res){
    try {
        let user = await User.find({}).sort('-createdAt');
        
        return res.render('home',{
            title : "Home Page",
            all_user : user
        })
    } catch (error) {
        console.log("error in home controller",error);
        return;
    }
        
}

// this will sign-out the user from website
module.exports.signOut = function(req,res){
    req.logout();
    req.flash('success','user successfully logged out');
    return res.redirect('/');
}