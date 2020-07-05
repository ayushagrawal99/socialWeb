const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');

// we use passport local strategy
passport.use(new localStrategy({
    usernameField : 'email',
    passReqToCallback : true                  // this allow us to set req argument here
}, function(req,email,password,done){
    User.findOne({email : email}, function(err,user){
        if(err){
            req.flash('error','error in finding user');
            return;
        }
        if(!user || user.password != password){
            req.flash('error','Invalid Username or Password');
            return done(null,false);
        }
        return done(null,user);
    })
}))

// used to serialize the user for the store session cookies
passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

// used to deserialize the user to find which user is there
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err){
            console.log("error in deserialize the user",err);
            return;
        }
        done(err, user);
    });
});

// check if user is authenticate
passport.checkAuthentication = function(req,res,next){
    // find out req is authenticated or not
    // if user is signed in then pass the req to next fun (controller action)
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/sign-in');
}

// this middleware function is use for set user in locals i.e. front-end side
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;