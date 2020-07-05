const passport = require('passport');

// Passport strategies for authenticating with Google using ONLY OAuth 2.0.
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

// we use google strategy for log-in
passport.use(new googleStrategy({
    // ye 3no hmne jb google pe identity save ki thi tb mila hoga
    clientID: "1054227222064-7knpgi38dd1aipset8n466hgqgdfrtfn.apps.googleusercontent.com",
    clientSecret: "PZ99muHLbd_q65ymmabZPjkB",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // yaha profile.emails[0].value ka mtlb ye email dega jo hmne google wala mail select kiya tha. basically profile mein emails name ka ek field h
    // jismein hum jo v email set krte h (mtlb google log-in ke time) wo array mein aa jata h or hm usko emails[0] krke fetch kr lete h
    // emails: [ { value: 'ayushelect2020@gmail.com', verified: true } ], like this
    User.findOne({ email: profile.emails[0].value })   
    .exec(function (err, user) {
        if(err){
            console.log("error in google log in",err);
            return;
        }
        // if google ko apne database mein user mil gaya to user de dega
        if(user){
            return done(null,user);
        } else {
            // if user not found, then we create a user
            console.log(profile)
            User.create({
                name : profile.displayName,
                email : profile.emails[0].value,                         
                password : crypto.randomBytes(20).toString('hex')
            },function (err, user) {
                if(err){
                    console.log("error in google log in",err);
                    return;
                }
                return done(null, user);
              })
        }
      }) 
  }
));

module.exports = passport;
