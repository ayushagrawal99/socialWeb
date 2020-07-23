const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');
const User = require('../models/users');
const env = require('./environment');

passport.use(new githubStrategy({
    clientID: env.github_client_id,
    clientSecret: env.github_client_secret,
    callbackURL: env.github_callback_url
},
function(accessToken, refreshToken, profile, cb) {
    User.findOne({email : profile.username}).exec(function(err,user){
        if(err){
            console.log("error in github starategy",err);
            return;
        }
        if(user){
            // if found, set this user as req.user
            return cb(null,user);
        } else {
            // not found, create a user nd set it as req.user
            User.create({
                name : profile.displayName,
                email : profile.username,
                password : crypto.randomBytes(20).toString('hex')
            }, function(err,user){
                if(err){
                    console.log("error in creating user",err);
                    return;
                }
                return cb(null,user);
            })
        }
    })
  }
))

module.exports = passport;