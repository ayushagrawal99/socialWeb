const mongoose = require('mongoose');
const resetPasswordSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // we store the token for validato=ion of user. it's unique 
    accesstoken : {
        type : String
    },
    // It tell us that accesstoken is valid or not
    isValid : {
        type : Boolean
    }
},{
    timestamps : true
});

const resetPassword = mongoose.model('resetPassword',resetPasswordSchema);
module.exports = resetPassword;