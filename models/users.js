const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatar');

const userSchema =  new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    }, 
    password : {
        type : String,
        required : true
    }, 
    phone : {
        type : String
    },
    // ye hamare saare friends ko store krke rakhega
    friends : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    // ye basically friend request ko store krke rakhega ki kisne-kisne friend request send ki h
    sendfriendRequest : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    // ye frnd req receive krega, sender ki id store hogi esmein
    receivefriendRequest : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    // avatar : {
    //     type : String
    // },
    avatar : [
        {
            type : String
        }
    ]

},{
    timestamps : true
});

// The disk storage engine gives us full control on storing files to disk.
var storage = multer.diskStorage({
    // destination is used to determine within which folder the uploaded files should be stored.
    destination : function(req, file, cb){
        cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },
    // filename is used to determine what the file should be named inside the folder
    filename : function(req,file ,cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// now we assign all property i.e. dest,filename to the multer so we use this 
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
// userSchema.statics.uploadedAvatar = multer({storage : storage}).fields([
//     {
//         name : 'avatar',
//         maxCount : 10
//     }
// ]);
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);
module.exports = User;