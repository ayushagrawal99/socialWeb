const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const router = require('./routes/home');
const app = express();
require('./config/views-helper')(app);
const port = 8000;
const db = require('./config/mongoose');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');

// we need to store userID in session-cookies. so this is done by express-session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local');
const mongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportGithub = require('./config/passport-github2');
const flash = require('connect-flash');
const customMiddleware = require('./config/flash-middleware');

app.set('view engine', 'ejs');
app.set('views','./views');

const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src : path.join(__dirname, env.asset_path, 'scss'),
        dest : path.join(__dirname, env.asset_path, 'css'),
        debug : true,
        outputStyle : 'extended',
        prefix : '/css'
    }))
}

app.use(express.urlencoded());
app.use(cookieParser());

// we require a middleware which take a session cookie and encrypte it. 
// mongo store is used to store the session cookies in DB
app.use(session({
    name : 'socialweb',
    secret: env.session_cookie_key,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge : (1000*60*100)
    },
    store : new mongoStore({
        mongooseConnection : db,
        autoRemove : 'disabled'
    },
    function(err){
        console.log(err || "connect mongoDB setup");
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(env.asset_path));
app.use(expressLayout);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true)

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use('/uploads', express.static(__dirname +'/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.use('/',require('./routes/home'));

app.listen(port, function(err){
    if(err){
        console.log("error in express setup",err);
        return;
    }
    console.log(`Express run fine at port : ${port}`);
})