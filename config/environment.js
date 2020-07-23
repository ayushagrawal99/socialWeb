const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path : logDirectory
});
 
const development = {
    name : 'development',
    asset_path : './assets',
    session_cookie_key : 'socialweb',
    db : 'social_web',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        post : 587,
        secure : false,
        auth : {
            user : "ayushelect2020@gmail.com",
            pass : "narshing@2020"
        }
    },
    google_client_id: "1054227222064-7knpgi38dd1aipset8n466hgqgdfrtfn.apps.googleusercontent.com",
    google_client_secret: "PZ99muHLbd_q65ymmabZPjkB",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    github_client_id: "432b99acdb63c574cd55",
    github_client_secret: "d2e9fd37790a6fca053364347af7ed9588e3489e",
    github_callback_url: "http://localhost:8000/users/auth/github/callback",
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}
    }
}

const production = {
    name : 'production',
    asset_path : process.env.SOCIALWEB_ASSET_PATH,
    session_cookie_key : process.env.SOCIALWEB_SESSION_COOKIE_KEY,
    db : process.env.SOCIALWEB_DB,
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        post : 587,
        secure : false,
        auth : {
            user : process.env.SOCIALWEB_GMAIL_USERNAME,
            pass : process.env.SOCIALWEB_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.SOCIALWEB_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.SOCIALWEB_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.SOCIALWEB_GOOGLE_CALLBACK_URL,
    github_client_id: process.env.SOCIALWEB_GITHUB_CLIENT_ID,
    github_client_secret: process.env.SOCIALWEB_GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.SOCIALWEB_GITHUB_CALLBACK_URL,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}
    }
}


console.log(process.env.SOCIALWEB_ENVIRONMENT);
module.exports = eval(process.env.SOCIALWEB_ENVIRONMENT) == undefined ? development : eval(process.env.SOCIALWEB_ENVIRONMENT);