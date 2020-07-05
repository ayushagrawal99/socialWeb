const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/social_web');

const db = mongoose.connection;
db.on('error', console.error.bind('console',"error in mongoose setup"));
db.once('open',function(){
    console.log("connected to db");
});

module.exports = db;